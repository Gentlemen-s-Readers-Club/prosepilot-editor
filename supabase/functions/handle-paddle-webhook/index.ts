import "jsr:@supabase/functions-js/edge-runtime.d.ts";
Deno.serve(async (req) => {
  try {
    // Check if the request method is POST
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
      });
    }
    // Get the raw request body
    const bodyRaw = await req.arrayBuffer();
    const bodyString = new TextDecoder().decode(bodyRaw);
    // Log the received data
    console.log("Received event:", bodyString);
    // Extract the Paddle-Signature header
    const paddleSignature = req.headers.get("Paddle-Signature");
    const secretKey =
      "pdl_ntfset_01jxev4nj3nmpv61q0hjssatp3_/GI8zuTs/31JVjz6RKvbgzuSfIjcauyM";
    // Check if Paddle-Signature is present
    if (!paddleSignature) {
      console.error("Paddle-Signature not present in request headers");
      return new Response("Invalid request", {
        status: 400,
      });
    }
    // Extract timestamp and signature from header
    const parts = paddleSignature.split(";");
    if (parts.length !== 2) {
      console.error("Invalid Paddle-Signature format");
      return new Response("Invalid request", {
        status: 400,
      });
    }
    const [timestampPart, signaturePart] = parts.map(
      (part) => part.split("=")[1]
    );
    if (!timestampPart || !signaturePart) {
      console.error(
        "Unable to extract timestamp or signature from Paddle-Signature header"
      );
      return new Response("Invalid request", {
        status: 400,
      });
    }
    // Validate timestamp (optional)
    const timestampInt = parseInt(timestampPart) * 1000;
    if (isNaN(timestampInt) || Date.now() - timestampInt > 5000) {
      console.error(
        "Webhook event expired (timestamp is over 5 seconds old):",
        timestampInt
      );
      return new Response("Event expired", {
        status: 408,
      });
    }
    // Build signed payload
    const signedPayload = `${timestampPart}:${bodyString}`;
    // Hash signed payload using HMAC SHA256 and the secret key
    const encoder = new TextEncoder();
    const key = encoder.encode(secretKey);
    const data = encoder.encode(signedPayload);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key,
      {
        name: "HMAC",
        hash: {
          name: "SHA-256",
        },
      },
      false,
      ["sign"]
    );
    const hmac = await crypto.subtle.sign("HMAC", cryptoKey, data);
    const hashedPayload = Array.from(new Uint8Array(hmac))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    // Compare signatures
    if (hashedPayload !== signaturePart) {
      console.error("Computed signature does not match Paddle signature");
      return new Response("Invalid signature", {
        status: 401,
      });
    }
    // Process the webhook event
    const eventData = JSON.parse(bodyString);
    console.log("Received webhook event type:", eventData.event_type);
    console.log("Parsed event data:", eventData); // Log the parsed event data
    // Extract relevant fields from the event data with safety checks
    const subscriptionId = eventData.data?.id;
    const priceId = eventData.data?.items?.[0]?.price?.id;
    const status = eventData.data?.status;
    // Handle billing period data safely (may be null for some events)
    const currentPeriodStart =
      eventData.data?.current_billing_period?.starts_at || null;
    const currentPeriodEnd =
      eventData.data?.current_billing_period?.ends_at || null;
    const userId = eventData.data?.custom_data?.user_id;
    // Validate required fields
    if (!subscriptionId || !priceId || !status || !userId) {
      console.error("Missing required fields in webhook data:", {
        subscriptionId,
        priceId,
        status,
        userId,
        eventType: eventData.event_type,
      });
      return new Response("Missing required webhook data", {
        status: 400,
      });
    }
    // Check if the user exists in the authentication section of Supabase using uid
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); // Use the service role key
    // Log all users in the authentication section
    const allUsersResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
      },
    });
    const allUsersData = await allUsersResponse.json();
    console.log("All users in auth section:", allUsersData); // Log all users
    // Check for the specific user
    const userCheckResponse = await fetch(
      `${supabaseUrl}/auth/v1/admin/users/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
        },
      }
    );
    // Log the response for debugging
    console.log("User check response status:", userCheckResponse.status);
    if (!userCheckResponse.ok) {
      const userCheckResponseBody = await userCheckResponse.text();
      console.log("User check response body:", userCheckResponseBody);
      console.error("Error checking user existence:", userCheckResponseBody);
      return new Response("Failed to check user existence", {
        status: 500,
      });
    }
    const userData = await userCheckResponse.json();
    console.log("User check response body:", userData);
    if (!userData) {
      console.error("User does not exist for uid:", userId);
      return new Response("User does not exist", {
        status: 404,
      });
    }
    // Check for existing active subscriptions for this user
    const existingSubscriptionsResponse = await fetch(
      `${supabaseUrl}/rest/v1/subscriptions?user_id=eq.${userId}&status=in.(active,trialing)&select=*`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
        },
      }
    );
    if (!existingSubscriptionsResponse.ok) {
      const errorData = await existingSubscriptionsResponse.text();
      console.error("Error checking existing subscriptions:", errorData);
      return new Response("Failed to check existing subscriptions", {
        status: 500,
      });
    }
    const existingSubscriptions = await existingSubscriptionsResponse.json();
    console.log(
      "Existing active subscriptions for user:",
      existingSubscriptions
    );
    // Prepare the subscription data for insertion or update
    const subscriptionData = {
      user_id: userId,
      subscription_id: subscriptionId,
      price_id: priceId,
      status: status,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
    };
    console.log("Subscription data to be processed:", subscriptionData);
    console.log("Event status:", status);
    console.log("Event type:", eventData.event_type);
    console.log("🐛 DEBUG: price_id from Paddle:", priceId);
    console.log(
      "🐛 DEBUG: This price_id needs to exist in subscription_plans table for credit refill to work"
    );
    // Special handling for canceled subscriptions
    if (
      status === "canceled" ||
      eventData.event_type === "subscription.canceled"
    ) {
      console.log("Processing canceled subscription event");
      // For canceled subscriptions, we only update the database, no API calls
      const response = await fetch(
        `${supabaseUrl}/rest/v1/subscriptions?subscription_id=eq.${subscriptionId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            apikey: serviceRoleKey,
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            status: "canceled",
            current_period_start: currentPeriodStart,
            current_period_end: currentPeriodEnd,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error updating canceled subscription:", errorData);
        return new Response("Failed to update canceled subscription", {
          status: 500,
        });
      }
      console.log("Canceled subscription processed successfully");
      return new Response(
        "Canceled subscription webhook processed successfully",
        {
          status: 200,
        }
      );
    }
    // Insert or update the subscription in the subscriptions table
    let response;
    if (
      status === "active" ||
      status === "subscription.activated" ||
      eventData.event_type === "subscription.activated"
    ) {
      // Check if user already has an active subscription for a different plan
      const hasActiveSubscriptionDifferentPlan = existingSubscriptions.some(
        (sub) =>
          sub.price_id !== priceId &&
          (sub.status === "active" || sub.status === "trialing")
      );
      if (hasActiveSubscriptionDifferentPlan) {
        console.warn(
          "User already has an active subscription for a different plan. This may indicate a plan change or multiple subscriptions."
        );
        // You might want to handle this case differently based on your business logic
        // For now, we'll log it but still process the new subscription
      }
      // Check if this exact subscription already exists
      const duplicateSubscription = existingSubscriptions.find(
        (sub) => sub.subscription_id === subscriptionId
      );
      if (duplicateSubscription) {
        console.log(
          "Subscription already exists, updating instead of inserting"
        );
        // Update existing subscription
        response = await fetch(
          `${supabaseUrl}/rest/v1/subscriptions?subscription_id=eq.${subscriptionId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${serviceRoleKey}`,
              "Content-Type": "application/json",
              apikey: serviceRoleKey,
              Prefer: "return=representation",
            },
            body: JSON.stringify({
              status: status,
              current_period_start: currentPeriodStart,
              current_period_end: currentPeriodEnd,
            }),
          }
        );
      } else {
        // Insert new subscription
        console.log("Attempting to INSERT new subscription");
        response = await fetch(`${supabaseUrl}/rest/v1/subscriptions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            apikey: serviceRoleKey,
            Prefer: "return=representation",
          },
          body: JSON.stringify(subscriptionData),
        });
      }
    } else {
      // Update existing subscription
      console.log("Attempting to UPDATE existing subscription");
      response = await fetch(
        `${supabaseUrl}/rest/v1/subscriptions?subscription_id=eq.${subscriptionId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            apikey: serviceRoleKey,
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            status: status,
            current_period_start: currentPeriodStart,
            current_period_end: currentPeriodEnd,
          }),
        }
      );
    }
    console.log("Supabase response status:", response.status);
    console.log(
      "Supabase response headers:",
      Object.fromEntries(response.headers.entries())
    );
    // Handle the response from the Supabase API
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error updating subscriptions table:", errorData);
      return new Response("Failed to update subscriptions", {
        status: 500,
      });
    }
    const responseData = await response.text();
    console.log("Supabase response data:", responseData);

    // Auto-refill credits for new or reactivated subscriptions
    if (
      status === "active" &&
      (eventData.event_type === "subscription.created" ||
        eventData.event_type === "subscription.activated" ||
        eventData.event_type === "subscription.updated")
    ) {
      console.log(
        `✅ Subscription saved. Now attempting to refill credits for user ${userId} with price_id: ${priceId}`
      );

      // Small delay to ensure database consistency and avoid race condition
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const refillResponse = await fetch(
          `${supabaseUrl}/functions/v1/handle-credits`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${serviceRoleKey}`,
              "Content-Type": "application/json",
              apikey: serviceRoleKey,
            },
            body: JSON.stringify({
              action: "refill_monthly",
              user_id: userId,
            }),
          }
        );

        if (refillResponse.ok) {
          const refillData = await refillResponse.json();
          console.log("💰 Credits refilled successfully:", refillData);
        } else {
          const errorText = await refillResponse.text();
          console.error("❌ Failed to refill credits:", errorText);
        }
      } catch (refillError) {
        console.error("💥 Error refilling credits:", refillError);
        // Don't fail the webhook for credit refill errors
      }
    }

    console.log("Subscription processed successfully");
    return new Response("Webhook received and processed successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
});
