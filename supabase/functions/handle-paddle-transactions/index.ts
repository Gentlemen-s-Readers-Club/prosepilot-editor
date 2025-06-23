import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Get the appropriate Paddle API key based on environment
function getPaddleApiKey(environment: string) {
  return environment === "production"
    ? Deno.env.get("PADDLE_API_KEY_PROD")
    : Deno.env.get("PADDLE_API_KEY");
}

// Get Paddle API base URL based on environment
function getPaddleApiBaseUrl(environment: string) {
  return environment === "production"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders,
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const {
      action,
      user_id,
      environment = "sandbox",
      transaction_id,
    } = await req.json();

    console.log("🔄 Processing transaction request:", {
      action,
      user_id,
      environment,
      transaction_id,
    });

    // Validate required fields
    if (!action || !user_id) {
      console.error("❌ Missing required fields:", { action, user_id });
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get Paddle configuration
    const paddleApiKey = getPaddleApiKey(environment);
    const paddleApiBaseUrl = getPaddleApiBaseUrl(environment);

    if (!paddleApiKey) {
      console.error(
        "❌ Paddle API key not configured for environment:",
        environment
      );
      return new Response(
        JSON.stringify({
          success: false,
          error: "Paddle API key not configured",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle different actions
    if (action === "get_invoice") {
      if (!transaction_id) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Transaction ID is required",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Fetch invoice URL from Paddle
      const response = await fetch(
        `${paddleApiBaseUrl}/transactions/${transaction_id}/invoice?disposition=inline`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${paddleApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("❌ Error fetching invoice:", errorData);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to fetch invoice",
            details: errorData,
          }),
          {
            status: response.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const invoiceData = await response.json();
      return new Response(
        JSON.stringify({
          success: true,
          data: invoiceData,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get customer ID for the user
    console.log("🔍 Starting customer ID lookup for user:", user_id);
    
    // First check subscriptions table for subscription_id
    const { data: subscriptions, error: subError } = await supabase
      .from("subscriptions")
      .select("subscription_id, customer_id")
      .eq("user_id", user_id)
      .eq("environment", environment)
      .order("created_at", { ascending: false })
      .limit(1);

    if (subError) {
      console.error("❌ Error fetching subscriptions:", subError);
    }

    console.log("📦 Raw subscriptions data:", JSON.stringify(subscriptions, null, 2));

    let customerId = null;
    const subscriptionId = subscriptions?.[0]?.subscription_id;

    // If we have a subscription ID, use it to get customer info from Paddle
    if (subscriptionId) {
      console.log("🔄 Found subscription ID, fetching customer info from Paddle:", subscriptionId);
      
      const subscriptionResponse = await fetch(
        `${paddleApiBaseUrl}/subscriptions/${subscriptionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${paddleApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("🔄 Paddle API response status:", subscriptionResponse.status);

      if (!subscriptionResponse.ok) {
        console.error("❌ Failed to fetch subscription details from Paddle");
      } else {
        const subscriptionData = await subscriptionResponse.json();
        console.log("📦 Raw Paddle subscription data:", JSON.stringify(subscriptionData, null, 2));
        
        customerId = subscriptionData.data?.customer_id;
        console.log("🔍 Found customer ID from Paddle API:", customerId);

        if (customerId) {
          // Update subscription record with customer ID if it's missing
          if (!subscriptions[0].customer_id) {
            console.log("📝 Updating subscription record with customer ID");
            const { error: updateError } = await supabase
              .from("subscriptions")
              .update({ customer_id: customerId })
              .eq("subscription_id", subscriptionId)
              .eq("environment", environment);

            if (updateError) {
              console.error("❌ Failed to update subscription with customer ID:", updateError);
            } else {
              console.log("✅ Updated subscription with customer ID:", customerId);
            }
          }
        }
      }
    }

    // If no customer ID from subscription, check profiles table as fallback
    if (!customerId) {
      console.log("🔍 No customer ID from subscription, checking profiles table");
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("paddle_customer_id")
        .eq("id", user_id)
        .single();

      if (profileError) {
        console.error("❌ Error fetching profile:", profileError);
      } else if (profile?.paddle_customer_id) {
        customerId = profile.paddle_customer_id;
        console.log("✅ Found customer ID from profiles:", customerId);
      }
    }

    if (!customerId) {
      console.error("❌ No customer ID found after checking all sources:", {
        checkedSubscriptionAPI: subscriptionId ? true : false,
        checkedProfiles: true,
        userId: user_id,
        environment: environment,
        subscriptionId: subscriptionId
      });
      return new Response(
        JSON.stringify({
          success: false,
          error: "Customer ID not found",
          details: "Could not find customer ID in Paddle API or profiles"
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("✅ Final customer ID being used:", customerId);

    // Fetch transactions from Paddle
    console.log("🔄 Fetching transactions from Paddle API for customer:", customerId);
    const response = await fetch(
      `${paddleApiBaseUrl}/transactions?customer_id=${customerId}&order_by=created_at[desc]`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paddleApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ Error from Paddle API:", errorData);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to fetch transactions",
          details: errorData,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const transactions = await response.json();
    console.log("✅ Successfully fetched transactions:", transactions);

    return new Response(JSON.stringify({ success: true, data: transactions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
