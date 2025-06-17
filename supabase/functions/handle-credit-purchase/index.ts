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

    const { action, user_id, package_id, checkout_id, transaction_id } =
      operation;

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
          checkout_id
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
        response = await completePurchase(supabase, user_id, transaction_id);
        break;

      case "get_packages":
        response = await getCreditPackages(supabase);
        break;

      case "get_user_purchases":
        response = await getUserPurchases(supabase, user_id);
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
    console.error("Error processing credit purchase operation:", error);
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

// Get available credit packages
async function getCreditPackages(supabase: any) {
  try {
    const { data, error } = await supabase
      .from("credit_packages")
      .select("*")
      .eq("is_active", true)
      .order("credits_amount");

    if (error) {
      console.error("Error getting credit packages:", error);
      return {
        success: false,
        error: "Failed to get credit packages",
      };
    }

    return {
      success: true,
      packages: data || [],
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
  checkout_id?: string
) {
  try {
    // First get the package details
    const { data: packageData, error: packageError } = await supabase
      .from("credit_packages")
      .select("*")
      .eq("id", package_id)
      .eq("is_active", true)
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

// Complete a credit purchase after Paddle webhook
async function completePurchase(
  supabase: any,
  user_id: string,
  transaction_id: string
) {
  try {
    console.log(
      `🔍 Starting completePurchase for user ${user_id}, transaction ${transaction_id}`
    );

    // Find the purchase by transaction ID
    const { data: purchase, error: findError } = await supabase
      .from("credit_purchases")
      .select("*")
      .eq("paddle_transaction_id", transaction_id)
      .eq("user_id", user_id)
      .single();

    if (findError || !purchase) {
      console.error("❌ Error finding purchase:", findError);
      console.error("❌ Query parameters:", { transaction_id, user_id });
      return {
        success: false,
        error: "Purchase not found",
      };
    }

    console.log("✅ Found purchase record:", purchase);

    if (purchase.status === "completed") {
      console.log("ℹ️ Purchase already completed, skipping");
      return {
        success: true,
        message: "Purchase already completed",
        purchase,
      };
    }

    // Update purchase status
    console.log("📝 Updating purchase status to completed...");
    const { error: updateError } = await supabase
      .from("credit_purchases")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", purchase.id);

    if (updateError) {
      console.error("❌ Error updating purchase:", updateError);
      return {
        success: false,
        error: "Failed to update purchase status",
      };
    }

    console.log("✅ Purchase status updated to completed");

    // Check current user credits before adding
    console.log("🔍 Checking current user credits...");
    const { data: currentCredits } = await supabase
      .from("user_credits")
      .select("*")
      .eq("user_id", user_id)
      .single();

    console.log("📊 Current user credits:", currentCredits);

    // Add credits to user account
    console.log(
      `💰 Adding ${purchase.credits_amount} credits to user account...`
    );
    const { data: rpcResult, error: creditsError } = await supabase.rpc(
      "add_purchased_credits",
      {
        p_user_id: user_id,
        p_purchase_id: purchase.id,
        p_credits_amount: purchase.credits_amount,
        p_description: `Purchased ${purchase.credits_amount} credits`,
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
      .eq("user_id", user_id)
      .single();

    console.log("📊 Updated user credits:", updatedCredits);

    console.log(
      `✅ Added ${purchase.credits_amount} credits to user ${user_id}`
    );

    return {
      success: true,
      message: "Purchase completed successfully",
      purchase: {
        ...purchase,
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
async function getUserPurchases(supabase: any, user_id: string) {
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
