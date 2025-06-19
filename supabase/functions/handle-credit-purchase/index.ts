import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const operation = await req.json();

    console.log("🔍 Received credit purchase operation:", operation);

    const {
      action,
      user_id,
      package_id,
      checkout_id,
      transaction_id,
      environment = "sandbox",
    } = operation;

    // Validate required fields
    if (!action) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing action field",
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

    // user_id is required for all actions except get_packages
    if (!user_id && action !== "get_packages") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing user_id field",
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

    let response;

    switch (action) {
      case "create_purchase":
        if (!package_id) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "package_id required for create_purchase",
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
        response = await createPurchase(
          supabase,
          user_id,
          package_id,
          checkout_id,
          environment
        );
        break;

      case "complete_purchase":
        if (!transaction_id) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "transaction_id required for complete_purchase",
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
        response = await completePurchase(
          supabase,
          user_id,
          transaction_id,
          environment
        );
        break;

      case "get_packages":
        response = await getCreditPackages(supabase, environment);
        break;

      case "get_user_purchases":
        response = await getUserPurchases(supabase, user_id, environment);
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
    console.error("Error handling request:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
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

// Get available credit packages
async function getCreditPackages(supabase: any, environment: string) {
  try {
    console.log("🌍 Getting credit packages for environment:", environment);

    const { data, error } = await supabase
      .from("credit_packages")
      .select("*")
      .eq("is_active", true)
      .eq("environment", environment)
      .order("credits_amount");

    if (error) {
      console.error("Error getting credit packages:", error);
      return {
        success: false,
        error: "Failed to get credit packages",
      };
    }

    console.log(
      `✅ Found ${
        data?.length || 0
      } credit packages for ${environment} environment`
    );
    return {
      success: true,
      packages: data,
    };
  } catch (error) {
    console.error("Error in getCreditPackages:", error);
    return {
      success: false,
      error: "Failed to get credit packages",
    };
  }
}

// Create a new credit purchase record
async function createPurchase(
  supabase: any,
  user_id: string,
  package_id: string,
  checkout_id?: string,
  environment: string = "sandbox"
) {
  try {
    // First get the package details
    const { data: packageData, error: packageError } = await supabase
      .from("credit_packages")
      .select("*")
      .eq("id", package_id)
      .eq("is_active", true)
      .eq("environment", environment)
      .single();

    if (packageError || !packageData) {
      console.error("Error getting package:", packageError);
      return {
        success: false,
        error: "Invalid package ID",
      };
    }

    // Create purchase record
    const { data, error } = await supabase
      .from("credit_purchases")
      .insert({
        user_id,
        credit_package_id: package_id,
        credits_amount: packageData.credits_amount,
        price_paid_cents: packageData.price_cents,
        currency: packageData.currency,
        paddle_checkout_id: checkout_id,
        status: "pending",
        environment: environment,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating purchase:", error);
      return {
        success: false,
        error: "Failed to create purchase record",
      };
    }

    console.log("✅ Purchase record created:", data.id);

    return {
      success: true,
      purchase: data,
    };
  } catch (error) {
    console.error("Error in createPurchase:", error);
    return {
      success: false,
      error: "Failed to create purchase",
    };
  }
}

// Complete a credit purchase
async function completePurchase(
  supabase: any,
  userId: string,
  transactionId: string,
  environment: string
) {
  try {
    console.log("🌍 Completing purchase in environment:", environment);

    // Get the purchase record
    const { data: purchases, error: purchaseError } = await supabase
      .from("credit_purchases")
      .select("*, credit_packages(*)")
      .eq("paddle_transaction_id", transactionId)
      .eq("user_id", userId)
      .eq("environment", environment)
      .single();

    if (purchaseError || !purchases) {
      console.error("Error getting purchase record:", purchaseError);
      return {
        success: false,
        error: "Purchase record not found",
      };
    }

    console.log("✅ Purchase record found:", purchases);

    // Complete the purchase
    const { data: updatedPurchase, error: updateError } = await supabase
      .from("credit_purchases")
      .update({
        status: "completed",
        paddle_transaction_id: transactionId,
        completed_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("paddle_checkout_id", transactionId)
      .eq("environment", environment)
      .select()
      .single();

    if (updateError || !updatedPurchase) {
      console.error("Error completing purchase:", updateError);
      return {
        success: false,
        error: "Failed to complete purchase",
        details: updateError,
      };
    }

    console.log("✅ Purchase record updated:", updatedPurchase);

    // Add credits to user account
    console.log(
      `💰 Adding ${updatedPurchase.credits_amount} credits to user account...`
    );
    const { data: rpcResult, error: creditsError } = await supabase.rpc(
      "add_purchased_credits",
      {
        p_user_id: userId,
        p_purchase_id: updatedPurchase.id,
        p_credits_amount: updatedPurchase.credits_amount,
        p_description: `Purchased ${updatedPurchase.credits_amount} credits`,
      }
    );

    console.log("🔧 RPC result:", rpcResult);

    if (creditsError) {
      console.error("❌ Error adding credits:", creditsError);
      return {
        success: false,
        error: "Failed to add credits to account",
        details: creditsError,
      };
    }

    // Check user credits after adding
    console.log("🔍 Checking user credits after adding...");
    const { data: updatedCredits } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", userId)
      .single();

    console.log("📊 Updated user credits:", updatedCredits);

    console.log(
      `✅ Added ${updatedPurchase.credits_amount} credits to user ${userId}`
    );

    return {
      success: true,
      message: "Purchase completed successfully",
      purchase: {
        ...updatedPurchase,
        status: "completed",
        completed_at: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("💥 Error in completePurchase:", error);
    return {
      success: false,
      error: "Failed to complete purchase",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get user's purchase history
async function getUserPurchases(
  supabase: any,
  user_id: string,
  environment: string
) {
  try {
    const { data, error } = await supabase
      .from("credit_purchases")
      .select(
        `
        *,
        credit_packages (
          name,
          credits_amount,
          price_cents,
          currency
        )
      `
      )
      .eq("user_id", user_id)
      .eq("environment", environment)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getting user purchases:", error);
      return {
        success: false,
        error: "Failed to get purchase history",
      };
    }

    return {
      success: true,
      purchases: data || [],
    };
  } catch (error) {
    console.error("Error in getUserPurchases:", error);
    return {
      success: false,
      error: "Failed to get purchase history",
    };
  }
}
