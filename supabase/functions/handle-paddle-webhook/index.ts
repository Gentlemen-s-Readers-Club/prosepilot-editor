import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Get the appropriate webhook secret based on environment
function getWebhookSecret() {
  const env = Deno.env.get("PADDLE_ENV") || "sandbox";
  return env === "production"
    ? Deno.env.get("PADDLE_WEBHOOK_SECRET_PROD")
    : Deno.env.get("PADDLE_WEBHOOK_SECRET");
}

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
    const secretKey = getWebhookSecret();

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
    console.log("Parsed event data:", eventData);

    // Get Supabase credentials
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    // Route to appropriate handler based on event type and custom data
    if (eventData.event_type.startsWith("subscription.")) {
      return await handleSubscriptionEvent(
        eventData,
        supabaseUrl,
        serviceRoleKey
      );
    } else if (eventData.event_type.startsWith("transaction.")) {
      // For transactions, check custom data type to distinguish subscription vs credit purchases
      const transactionType = eventData.data?.custom_data?.type;

      if (transactionType === "credit_purchase") {
        console.log("🛒 Routing to credit purchase handler");
        return await handleTransactionEvent(
          eventData,
          supabaseUrl,
          serviceRoleKey
        );
      } else if (transactionType === "subscription") {
        console.log(
          "📅 Routing subscription transaction to subscription handler"
        );
        return await handleSubscriptionEvent(
          eventData,
          supabaseUrl,
          serviceRoleKey
        );
      } else {
        console.log(
          "Unidentified transaction type:",
          transactionType,
          "- processing as potential subscription"
        );
        // Default to subscription handler for backward compatibility
        return await handleSubscriptionEvent(
          eventData,
          supabaseUrl,
          serviceRoleKey
        );
      }
    } else {
      console.log("Unsupported event type:", eventData.event_type);
      return new Response("Event type not supported", {
        status: 200, // Return 200 to avoid retries for unsupported events
      });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
});

// Handle subscription-related events
async function handleSubscriptionEvent(
  eventData: any,
  supabaseUrl: string,
  serviceRoleKey: string
) {
  console.log("🔄 Processing subscription event:", eventData.event_type);

  // Get the current environment from env var
  const environment = Deno.env.get("PADDLE_ENV") || "sandbox";
  console.log("🌍 Processing subscription in environment:", environment);

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
    console.error("Missing required fields in subscription webhook data:", {
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

  // Check if the user exists
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

  if (!userCheckResponse.ok) {
    console.error("User does not exist for uid:", userId);
    return new Response("User does not exist", {
      status: 404,
    });
  }

  // Check for existing active subscriptions for this user
  const existingSubscriptionsResponse = await fetch(
    `${supabaseUrl}/rest/v1/subscriptions?user_id=eq.${userId}&status=in.(active,trialing)&environment=eq.${environment}&select=*`,
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

  // Prepare the subscription data for insertion or update
  const subscriptionData = {
    user_id: userId,
    subscription_id: subscriptionId,
    price_id: priceId,
    status: status,
    current_period_start: currentPeriodStart,
    current_period_end: currentPeriodEnd,
    environment: environment,
  };

  console.log("Subscription data to be processed:", subscriptionData);

  // Special handling for canceled subscriptions
  if (
    status === "canceled" ||
    eventData.event_type === "subscription.canceled"
  ) {
    console.log("Processing canceled subscription event");

    // Update the subscription status
    const response = await fetch(
      `${supabaseUrl}/rest/v1/subscriptions?subscription_id=eq.${subscriptionId}&environment=eq.${environment}`,
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

  // Insert or update the subscription
  let response;
  if (existingSubscriptions.length > 0) {
    console.log("Attempting to UPDATE existing subscription");
    response = await fetch(
      `${supabaseUrl}/rest/v1/subscriptions?subscription_id=eq.${subscriptionId}&environment=eq.${environment}`,
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

  // Handle the response from the Supabase API
  if (!response.ok) {
    const errorData = await response.text();
    console.error("Error updating subscriptions table:", errorData);
    return new Response("Failed to update subscriptions", {
      status: 500,
    });
  }

  // Auto-refill credits for new or reactivated subscriptions
  if (
    status === "active" &&
    (eventData.event_type === "subscription.created" ||
      eventData.event_type === "subscription.activated" ||
      eventData.event_type === "subscription.updated")
  ) {
    console.log(
      `✅ Subscription saved. Now attempting to refill credits for user ${userId}`
    );

    // Small delay to ensure database consistency
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
            environment: environment,
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
    }
  }

  console.log("Subscription event processed successfully");
  return new Response("Subscription webhook processed successfully", {
    status: 200,
  });
}

// Handle transaction-related events (for credit purchases)
async function handleTransactionEvent(
  eventData: any,
  supabaseUrl: string,
  serviceRoleKey: string
) {
  console.log("💳 Processing transaction event:", eventData.event_type);

  // Only handle completed transactions
  if (eventData.event_type !== "transaction.completed") {
    console.log(
      "Ignoring non-completed transaction event:",
      eventData.event_type
    );
    return new Response("Transaction event ignored", {
      status: 200,
    });
  }

  // Extract transaction data
  const transactionId = eventData.data?.id;
  const userId = eventData.data?.custom_data?.user_id;
  const purchaseId = eventData.data?.custom_data?.purchase_id;
  const transactionType = eventData.data?.custom_data?.type;

  console.log("Transaction details:", {
    transactionId,
    userId,
    purchaseId,
    transactionType,
  });

  // Validate this is a credit purchase transaction
  if (transactionType !== "credit_purchase" || !purchaseId) {
    console.log("Not a credit purchase transaction, ignoring");
    return new Response("Not a credit purchase transaction", {
      status: 200,
    });
  }

  // Validate required fields
  if (!transactionId || !userId || !purchaseId) {
    console.error("Missing required fields in transaction webhook data:", {
      transactionId,
      userId,
      purchaseId,
    });
    return new Response("Missing required transaction data", {
      status: 400,
    });
  }

  try {
    // First, update the purchase record with the transaction ID
    const updatePurchaseResponse = await fetch(
      `${supabaseUrl}/rest/v1/credit_purchases?id=eq.${purchaseId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          paddle_transaction_id: transactionId,
        }),
      }
    );

    if (!updatePurchaseResponse.ok) {
      const errorData = await updatePurchaseResponse.text();
      console.error(
        "Error updating purchase record with transaction ID:",
        errorData
      );
      return new Response("Failed to update purchase record", {
        status: 500,
      });
    }

    const updatedPurchase = await updatePurchaseResponse.json();
    console.log(
      "✅ Purchase record updated with transaction ID:",
      updatedPurchase
    );

    // Get the purchase details
    if (updatedPurchase.length === 0) {
      console.error("Purchase record not found:", purchaseId);
      return new Response("Purchase record not found", {
        status: 404,
      });
    }

    const purchase = updatedPurchase[0];
    const creditsAmount = purchase.credits_amount;

    // Now complete the purchase and add credits
    const addCreditsResponse = await fetch(
      `${supabaseUrl}/functions/v1/handle-credit-purchase`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
        },
        body: JSON.stringify({
          action: "complete_purchase",
          user_id: userId,
          transaction_id: transactionId,
        }),
      }
    );

    if (addCreditsResponse.ok) {
      const creditsData = await addCreditsResponse.json();
      console.log("💰 Credits added successfully:", creditsData);

      console.log(
        `✅ Credit purchase completed: ${creditsAmount} credits added to user ${userId}`
      );
      return new Response("Credit purchase webhook processed successfully", {
        status: 200,
      });
    } else {
      const errorText = await addCreditsResponse.text();
      console.error("❌ Failed to add credits:", errorText);
      return new Response("Failed to add credits to user account", {
        status: 500,
      });
    }
  } catch (error) {
    console.error("💥 Error processing credit purchase:", error);
    return new Response("Error processing credit purchase", {
      status: 500,
    });
  }
}
