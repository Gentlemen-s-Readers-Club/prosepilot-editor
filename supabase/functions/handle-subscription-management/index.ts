import "jsr:@supabase/functions-js/edge-runtime.d.ts";
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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
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

    // Parse request body
    const operation = await req.json();
    console.log("🔍 Received subscription management operation:", operation);

    const {
      action,
      user_id,
      subscription_id,
      cancellation_reason,
      environment = "sandbox",
    } = operation;
    const paddleApiKey = getPaddleApiKey(environment);

    if (!supabaseUrl || !supabaseServiceKey || !paddleApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required environment variables",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Determine API URL based on environment
    const isSandbox = environment === "sandbox";
    const paddleBaseUrl = isSandbox
      ? "https://sandbox-api.paddle.com"
      : "https://api.paddle.com";

    console.log(
      `🌐 Using Paddle ${environment.toUpperCase()} API: ${paddleBaseUrl}`
    );

    let response;

    switch (action) {
      case "cancel_subscription":
        if (!subscription_id) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "subscription_id required for cancel_subscription",
            }),
            {
              status: 400,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        }
        response = await cancelSubscription(
          supabase,
          paddleApiKey,
          paddleBaseUrl,
          user_id,
          subscription_id,
          cancellation_reason
        );
        break;

      case "get_subscription_details":
        if (!subscription_id) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "subscription_id required for get_subscription_details",
            }),
            {
              status: 400,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        }
        response = await getSubscriptionDetails(
          paddleApiKey,
          paddleBaseUrl,
          subscription_id
        );
        break;

      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid action",
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
    }

    return new Response(JSON.stringify(response), {
      status: response.success ? 200 : 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing subscription management operation:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

// Cancel a subscription using Paddle API
async function cancelSubscription(
  supabase: any,
  paddleApiKey: string,
  paddleBaseUrl: string,
  userId: string,
  subscriptionId: string,
  cancellationReason?: string
) {
  try {
    console.log(
      `🚫 Cancelling subscription ${subscriptionId} for user ${userId}`
    );

    // First, verify the subscription belongs to the user
    const { data: subscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("subscription_id", subscriptionId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !subscription) {
      console.error(
        "Subscription not found or doesn't belong to user:",
        fetchError
      );
      return {
        success: false,
        error: "Subscription not found or access denied",
      };
    }

    // Call Paddle API to cancel subscription immediately
    const requestBody = {
      effective_from: "immediately", // Cancel immediately, not at next billing period
      ...(cancellationReason && { reason: cancellationReason }),
    };

    console.log("📤 Sending immediate cancel request to Paddle:", requestBody);

    const paddleResponse = await fetch(
      `${paddleBaseUrl}/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paddleApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!paddleResponse.ok) {
      const errorData = await paddleResponse.text();
      console.error("Paddle API error:", errorData);
      return {
        success: false,
        error: "Failed to cancel subscription with Paddle",
        details: errorData,
      };
    }

    const paddleData = await paddleResponse.json();
    console.log("✅ Subscription cancelled with Paddle:", paddleData);

    // Update local subscription record
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        status: "canceled",
        updated_at: new Date().toISOString(),
      })
      .eq("subscription_id", subscriptionId)
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error updating local subscription record:", updateError);
      // Don't return error here since Paddle cancellation succeeded
    }

    return {
      success: true,
      message:
        "Subscription cancelled successfully. You will no longer be charged.",
      subscription: paddleData.data,
    };
  } catch (error) {
    console.error("Error in cancelSubscription:", error);
    return {
      success: false,
      error: "Failed to cancel subscription",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get subscription details from Paddle
async function getSubscriptionDetails(
  paddleApiKey: string,
  paddleBaseUrl: string,
  subscriptionId: string
) {
  try {
    console.log(`📋 Fetching subscription details for ${subscriptionId}`);

    const paddleResponse = await fetch(
      `${paddleBaseUrl}/subscriptions/${subscriptionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paddleApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!paddleResponse.ok) {
      const errorData = await paddleResponse.text();
      console.error("Paddle API error:", errorData);
      return {
        success: false,
        error: "Failed to fetch subscription details",
        details: errorData,
      };
    }

    const paddleData = await paddleResponse.json();
    console.log("✅ Subscription details fetched:", paddleData.data);

    return {
      success: true,
      subscription: paddleData.data,
    };
  } catch (error) {
    console.error("Error in getSubscriptionDetails:", error);
    return {
      success: false,
      error: "Failed to fetch subscription details",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
