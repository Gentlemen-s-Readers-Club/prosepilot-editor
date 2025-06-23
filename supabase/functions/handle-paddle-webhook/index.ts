import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Deno runtime API
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response>): void;
};

// Paddle API types
interface PaddleCustomer {
  id: string;
}

interface PaddleSubscriptionResponse {
  data?: {
    customer?: PaddleCustomer;
  };
}

interface PaddleWebhookEvent {
  event_type: string;
  data?: {
    id?: string;
    items?: Array<{
      price?: {
        id?: string;
      };
    }>;
    status?: string;
    customer?: PaddleCustomer;
    custom_data?: {
      user_id?: string;
      environment?: string;
      purchase_id?: string;
      type?: string;
    };
    current_billing_period?: {
      starts_at?: string;
      ends_at?: string;
    };
  };
}

// Get the appropriate webhook secret based on environment
function getWebhookSecret(environment: string) {
  return environment === "production"
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

    // Parse the event data to get environment from custom data
    const eventData = JSON.parse(bodyString);
    const environment = eventData.data?.custom_data?.environment || "sandbox";
    console.log("🌍 Processing webhook in environment:", environment);

    // Extract the Paddle-Signature header
    const paddleSignature = req.headers.get("Paddle-Signature");
    const secretKey = getWebhookSecret(environment);

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
  eventData: PaddleWebhookEvent,
  supabaseUrl: string,
  serviceRoleKey: string
) {
  console.log("📅 Processing subscription event:", eventData.event_type);
  console.log("📦 Raw event data:", eventData);

  // Extract subscription data
  const subscriptionId = eventData.data?.id;
  const userId = eventData.data?.custom_data?.user_id;
  const environment = eventData.data?.custom_data?.environment || "sandbox";
  const status = eventData.data?.status;
  const priceId = eventData.data?.items?.[0]?.price?.id;
  const customerId = eventData.data?.customer?.id;
  const currentPeriodStart = eventData.data?.current_billing_period?.starts_at;
  const currentPeriodEnd = eventData.data?.current_billing_period?.ends_at;

  console.log("🔍 Extracted subscription data:", {
    subscriptionId,
    userId,
    environment,
    status,
    priceId,
    customerId,
    currentPeriodStart,
    currentPeriodEnd,
  });

  // Validate required fields
  if (!subscriptionId || !userId || !status || !priceId) {
    console.error("❌ Missing required fields in webhook data:", {
      subscriptionId,
      userId,
      status,
      priceId,
    });
    return new Response("Missing required subscription data", {
      status: 400,
    });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if subscription already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("subscription_id", subscriptionId)
      .single();

    console.log("🔍 Existing subscription check:", {
      exists: !!existingSubscription,
      data: existingSubscription,
      error: checkError,
    });

    // Prepare subscription data
    const subscriptionData = {
      user_id: userId,
      subscription_id: subscriptionId,
      price_id: priceId,
      status,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      environment,
    };

    let response;
    if (existingSubscription) {
      // Update existing subscription
      console.log("🔄 Updating existing subscription:", subscriptionId);
      response = await supabase
        .from("subscriptions")
        .update(subscriptionData)
        .eq("subscription_id", subscriptionId)
        .select();
    } else {
      // Insert new subscription
      console.log("➕ Creating new subscription:", subscriptionId);
      response = await supabase
        .from("subscriptions")
        .insert([subscriptionData])
        .select();
    }

    if (response.error) {
      console.error("❌ Error saving subscription:", response.error);
      throw response.error;
    }

    console.log("✅ Subscription saved successfully:", response.data);

    return new Response("Subscription webhook processed successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("💥 Error processing subscription webhook:", error);
    return new Response("Error processing subscription", {
      status: 500,
    });
  }
}

// Handle transaction-related events (for credit purchases)
async function handleTransactionEvent(
  eventData: PaddleWebhookEvent,
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
