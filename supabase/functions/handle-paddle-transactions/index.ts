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
    console.log("🔍 Looking up customer ID for user:", user_id);
    const { data: subscriptions, error: subError } = await supabase
      .from("subscriptions")
      .select("customer_id, subscription_id")
      .eq("user_id", user_id)
      .eq("environment", environment)
      .order("created_at", { ascending: false })
      .limit(1);

    console.log("📦 Found subscriptions:", subscriptions);

    if (subError) {
      console.error("❌ Error fetching subscriptions:", subError);
    }

    if (subError || !subscriptions?.length) {
      console.log("❌ No subscription found for user:", user_id);
      return new Response(
        JSON.stringify({
          success: false,
          error: "No subscription found for user",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let customerId = subscriptions[0].customer_id;

    if (!customerId) {
      console.log(
        "⚠️ No customer ID found, fetching from Paddle API using subscription ID"
      );

      // Fetch subscription details from Paddle to get customer ID
      const subscriptionResponse = await fetch(
        `${paddleApiBaseUrl}/subscriptions/${subscriptions[0].subscription_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${paddleApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!subscriptionResponse.ok) {
        console.error("❌ Failed to fetch subscription details from Paddle");
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to fetch customer ID",
          }),
          {
            status: subscriptionResponse.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const subscriptionData = await subscriptionResponse.json();
      const paddleCustomerId = subscriptionData.data?.customer?.id;

      if (!paddleCustomerId) {
        console.error("❌ No customer ID found in Paddle subscription data");
        return new Response(
          JSON.stringify({
            success: false,
            error: "Customer ID not found",
          }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Update subscription record with customer ID
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ customer_id: paddleCustomerId })
        .eq("subscription_id", subscriptions[0].subscription_id)
        .eq("environment", environment);

      if (updateError) {
        console.error(
          "❌ Failed to update subscription with customer ID:",
          updateError
        );
      } else {
        console.log(
          "✅ Updated subscription with customer ID:",
          paddleCustomerId
        );
      }

      // Use the fetched customer ID
      customerId = paddleCustomerId;
    }

    console.log("✅ Using customer ID:", customerId);

    // Fetch transactions from Paddle
    console.log("🔄 Fetching transactions from Paddle API...");
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
