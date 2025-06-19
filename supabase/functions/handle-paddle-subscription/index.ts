import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Check if the request method is POST
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders,
      });
    }
    // Get the request body
    const bodyRaw = await req.arrayBuffer();
    const bodyString = new TextDecoder().decode(bodyRaw);
    const requestData = JSON.parse(bodyString);
    // Extract necessary fields from the request
    const {
      action,
      subscriptionId,
      newPlanId,
      effectiveFrom,
      environment = "sandbox",
    } = requestData;
    // Validate input
    if (
      !action ||
      !subscriptionId ||
      (action === "change_plan" && !newPlanId)
    ) {
      return new Response("Invalid request data", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Get environment-specific Paddle API key
    const paddleApiKey = getPaddleApiKey(environment);
    const isSandbox = environment === "sandbox";
    const paddleApiBaseUrl = isSandbox
      ? "https://sandbox-api.paddle.com"
      : "https://api.paddle.com";

    console.log(
      `🌐 Using Paddle ${environment.toUpperCase()} API: ${paddleApiBaseUrl}`
    );

    // Validate environment variables
    if (!paddleApiKey) {
      return new Response(
        JSON.stringify({
          error: "Server configuration error - missing Paddle API key",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let apiResponse;

    // Handle cancellation using modern Paddle API
    if (action === "cancel") {
      // First, check the current subscription status
      const statusResponse = await fetch(
        `${paddleApiBaseUrl}/subscriptions/${subscriptionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${paddleApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!statusResponse.ok) {
        const statusErrorText = await statusResponse.text();
        console.error("Error checking subscription status:", statusErrorText);

        let statusErrorResponse;
        try {
          statusErrorResponse = JSON.parse(statusErrorText);
        } catch {
          statusErrorResponse = { error: statusErrorText };
        }

        return new Response(JSON.stringify(statusErrorResponse), {
          status: statusResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const subscriptionData = await statusResponse.json();
      const currentStatus = subscriptionData.data?.status;

      console.log("Current subscription status from Paddle:", currentStatus);
      console.log(
        "Full subscription data:",
        JSON.stringify(subscriptionData.data, null, 2)
      );

      // Check if subscription is already canceled or in a non-cancellable state
      if (currentStatus === "canceled") {
        console.log("Subscription is already canceled, returning success");
        return new Response(
          JSON.stringify({
            message: "Subscription is already canceled",
            data: subscriptionData.data,
            success: true,
            action,
            subscriptionId,
            effectiveFrom,
            alreadyCanceled: true,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Check for other non-cancellable states
      if (["past_due", "unpaid"].includes(currentStatus)) {
        console.log(
          `Subscription status is ${currentStatus}, treating as already canceled`
        );
        return new Response(
          JSON.stringify({
            message: `Subscription is in ${currentStatus} status and cannot be canceled`,
            data: subscriptionData.data,
            success: true,
            action,
            subscriptionId,
            effectiveFrom,
            alreadyCanceled: true,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Check if subscription can be canceled
      if (!["active", "trialing", "paused"].includes(currentStatus)) {
        return new Response(
          JSON.stringify({
            error: `Cannot cancel subscription with status: ${currentStatus}`,
            currentStatus,
            subscriptionId,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Proceed with cancellation
      const cancelPayload: Record<string, string> = {};

      // Add effective_from if specified (immediately or next_billing_period)
      if (effectiveFrom) {
        cancelPayload.effective_from = effectiveFrom;
      }
      // If no effectiveFrom specified, Paddle defaults to next_billing_period for active subscriptions

      apiResponse = await fetch(
        `${paddleApiBaseUrl}/subscriptions/${subscriptionId}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${paddleApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cancelPayload),
        }
      );
    } else if (action === "change_plan") {
      // Handle plan changes (this would need to be updated based on your specific Paddle setup)
      // This is a placeholder - you'll need to implement the actual plan change logic
      // based on whether you're using Paddle Classic or Paddle Billing
      return new Response(
        JSON.stringify({
          error: "Plan changes not yet implemented for modern Paddle API",
        }),
        {
          status: 501,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check the response from Paddle API
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Error from Paddle API:", errorText);

      let errorResponse;
      try {
        errorResponse = JSON.parse(errorText);
      } catch {
        errorResponse = { error: errorText };
      }

      return new Response(JSON.stringify(errorResponse), {
        status: apiResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiResponseBody = await apiResponse.json();

    // Return success response
    return new Response(
      JSON.stringify({
        message: "Operation successful",
        data: apiResponseBody,
        success: true,
        action,
        subscriptionId,
        effectiveFrom,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
