import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    // Check if the request method is POST
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
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
      return new Response("Invalid request", { status: 400 });
    }

    // Extract timestamp and signature from header
    const parts = paddleSignature.split(";");
    if (parts.length !== 2) {
      console.error("Invalid Paddle-Signature format");
      return new Response("Invalid request", { status: 400 });
    }

    const [timestampPart, signaturePart] = parts.map(
      (part) => part.split("=")[1]
    );

    if (!timestampPart || !signaturePart) {
      console.error(
        "Unable to extract timestamp or signature from Paddle-Signature header"
      );
      return new Response("Invalid request", { status: 400 });
    }

    // Validate timestamp (optional)
    const timestampInt = parseInt(timestampPart) * 1000;
    if (isNaN(timestampInt) || Date.now() - timestampInt > 5000) {
      console.error(
        "Webhook event expired (timestamp is over 5 seconds old):",
        timestampInt
      );
      return new Response("Event expired", { status: 408 });
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
      { name: "HMAC", hash: { name: "SHA-256" } },
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
      return new Response("Invalid signature", { status: 401 });
    }

    // Process the webhook event
    const eventData = JSON.parse(bodyString);
    console.log("Parsed event data:", eventData); // Log the parsed event data

    // Extract relevant fields from the event data
    const subscriptionId = eventData.data.id; // Paddle subscription ID
    const priceId = eventData.data.items[0].price.id; // Paddle price ID
    const status = eventData.data.status; // Subscription status from Paddle
    const currentPeriodStart = eventData.data.current_billing_period.starts_at; // Current period start
    const currentPeriodEnd = eventData.data.current_billing_period.ends_at; // Current period end
    const userId = eventData.data.custom_data.user_id; // Extract user_id from custom_data

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
      return new Response("Failed to check user existence", { status: 500 });
    }

    const userData = await userCheckResponse.json();
    console.log("User check response body:", userData);

    if (!userData) {
      console.error("User does not exist for uid:", userId);
      return new Response("User does not exist", { status: 404 });
    }

    // Check for existing active subscriptions for this user
    const existingSubscriptionsResponse = await fetch(
      `${supabaseUrl}/rest/v1/subscriptions?user_id=eq.${userId}&select=*`,
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
    console.log("Existing subscriptions for user:", existingSubscriptions);

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

    let response;

    // Handle different subscription events
    if (
      status === "active" ||
      eventData.event_type === "subscription.activated"
    ) {
      console.log("Processing active/activated subscription");

      // First, cancel any other active subscriptions for this user (ensure only one active)
      const activeSubscriptions = existingSubscriptions.filter(
        (sub: { status: string; subscription_id: string }) =>
          (sub.status === "active" || sub.status === "trialing") &&
          sub.subscription_id !== subscriptionId
      );

      if (activeSubscriptions.length > 0) {
        console.log(
          `Found ${activeSubscriptions.length} other active subscriptions to cancel`
        );

        for (const activeSub of activeSubscriptions) {
          await fetch(
            `${supabaseUrl}/rest/v1/subscriptions?subscription_id=eq.${activeSub.subscription_id}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${serviceRoleKey}`,
                "Content-Type": "application/json",
                apikey: serviceRoleKey,
              },
              body: JSON.stringify({
                status: "canceled",
                canceled_at: new Date().toISOString(),
                cancel_at_period_end: false,
              }),
            }
          );
          console.log(
            `Canceled previous subscription: ${activeSub.subscription_id}`
          );
        }
      }

      // Check if this exact subscription already exists
      const existingSubscription = existingSubscriptions.find(
        (sub: { subscription_id: string }) =>
          sub.subscription_id === subscriptionId
      );

      if (existingSubscription) {
        console.log("Updating existing subscription");
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
            body: JSON.stringify(subscriptionData),
          }
        );
      } else {
        console.log("Creating new subscription");
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
    } else if (
      status === "canceled" ||
      eventData.event_type === "subscription.canceled"
    ) {
      console.log("Processing canceled subscription");

      // Update the subscription status to canceled
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
            status: "canceled",
            canceled_at: new Date().toISOString(),
            cancel_at_period_end: false,
          }),
        }
      );
    } else if (
      status === "past_due" ||
      status === "paused" ||
      eventData.event_type === "subscription.updated"
    ) {
      console.log("Processing subscription status update");

      // Update existing subscription status
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
      console.log("Unknown subscription event, treating as status update");

      // Default: update subscription status
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
      return new Response("Failed to update subscriptions", { status: 500 });
    }

    const responseData = await response.text();
    console.log("Supabase response data:", responseData);

    console.log("Subscription processed successfully");
    return new Response("Webhook received and processed successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
