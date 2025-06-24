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

    console.log("🔍 Received operation:", operation);

    const {
      action,
      user_id,
      amount,
      book_generation_id,
      description,
      metadata,
      environment = "sandbox", // Add environment parameter with sandbox default
    } = operation;

    console.log("🌍 Processing credits operation in environment:", environment);

    // Validate required fields
    if (!action || !user_id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields",
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
      case "check_balance":
        response = await checkBalance(supabase, user_id, environment);
        break;
      case "reserve":
        if (!amount || !book_generation_id) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Amount and book_generation_id required for reserve",
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
        response = await reserveCredits(
          supabase,
          user_id,
          amount,
          book_generation_id,
          description,
          metadata,
          environment
        );
        break;
      case "consume":
        if (!book_generation_id) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "book_generation_id required for consume",
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
        response = await consumeCredits(
          supabase,
          user_id,
          book_generation_id,
          description,
          metadata,
          environment
        );
        break;
      case "refund":
        if (!book_generation_id) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "book_generation_id required for refund",
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
        response = await refundCredits(
          supabase,
          user_id,
          book_generation_id,
          description,
          metadata,
          environment
        );
        break;
      case "refill_monthly":
        response = await refillMonthlyCredits(supabase, user_id, environment);
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
    console.error("Error processing credit operation:", error);
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

// Check user's current credit balance
async function checkBalance(supabase, user_id, environment) {
  try {
    // First, try to initialize credits if they don't exist
    const { error: initError } = await supabase.rpc("manage_user_credits", {
      p_user_id: user_id,
      p_amount: 0,
      p_operation: "admin_adjust",
      p_reference_id: crypto.randomUUID(),
      p_reference_type: "initialization",
      p_description: "Initialize user credits",
      p_metadata: { initialized: true },
      p_environment: environment,
    });

    if (initError) {
      console.error("Error initializing credits:", initError);
    }

    // Now get the balance
    const { data, error } = await supabase
      .from("user_credits")
      .select("current_balance")
      .eq("user_id", user_id)
      .eq("environment", environment)
      .single();

    if (error) {
      console.error("Error checking balance:", error);
      return {
        success: false,
        error: "Failed to check balance",
      };
    }

    return {
      success: true,
      balance: data?.current_balance || 0,
    };
  } catch (error) {
    console.error("Error in checkBalance:", error);
    return {
      success: false,
      error: "Failed to check balance",
    };
  }
}

// Reserve credits for book generation (called when generation starts)
async function reserveCredits(
  supabase,
  user_id,
  amount,
  book_generation_id,
  description,
  metadata,
  environment
) {
  try {
    // Start a transaction
    const { data: updateResult, error: updateError } = await supabase.rpc(
      "manage_user_credits",
      {
        p_user_id: user_id,
        p_amount: -amount,
        p_operation: "consume",
        p_reference_id: book_generation_id,
        p_reference_type: "book_generation",
        p_description:
          description || `Reserved ${amount} credits for book generation`,
        p_metadata: {
          ...metadata,
          reserved: true,
        },
        p_environment: environment,
      }
    );

    if (updateError || !updateResult) {
      console.error("Error reserving credits:", updateError);
      return {
        success: false,
        error: "Insufficient credits or failed to reserve",
      };
    }

    // Update book generation record
    const { error: bookError } = await supabase
      .from("book_generations")
      .update({
        credits_reserved: amount,
        status: "processing",
        started_at: new Date().toISOString(),
        environment: environment,
      })
      .eq("id", book_generation_id);

    if (bookError) {
      console.error("Error updating book generation:", bookError);
      // Note: Credits are already deducted, but we log this for manual review
    }

    // Get updated balance
    const balanceResult = await checkBalance(supabase, user_id, environment);
    return {
      success: true,
      balance: balanceResult.balance,
      transaction_id: book_generation_id,
    };
  } catch (error) {
    console.error("Error in reserveCredits:", error);
    return {
      success: false,
      error: "Failed to reserve credits",
    };
  }
}

// Consume reserved credits (called when generation completes successfully)
async function consumeCredits(
  supabase,
  user_id,
  book_generation_id,
  description,
  metadata,
  environment
) {
  try {
    // Get book generation details
    const { data: bookGen, error: bookError } = await supabase
      .from("book_generations")
      .select("credits_reserved, status")
      .eq("id", book_generation_id)
      .eq("environment", environment)
      .single();

    if (bookError || !bookGen) {
      return {
        success: false,
        error: "Book generation not found",
      };
    }

    // Update book generation as completed
    const { error: updateError } = await supabase
      .from("book_generations")
      .update({
        status: "completed",
        credits_consumed: bookGen.credits_reserved,
        completed_at: new Date().toISOString(),
      })
      .eq("id", book_generation_id)
      .eq("environment", environment);

    if (updateError) {
      console.error("Error updating book generation:", updateError);
      return {
        success: false,
        error: "Failed to update book generation",
      };
    }

    // Log the consumption (credits were already deducted during reservation)
    const { error: logError } = await supabase
      .from("credit_transactions")
      .insert({
        user_id,
        transaction_type: "consume",
        amount: 0,
        balance_before: 0,
        balance_after: 0,
        reference_id: book_generation_id,
        reference_type: "book_generation_complete",
        description:
          description ||
          `Consumed ${bookGen.credits_reserved} credits for completed book generation`,
        metadata: {
          ...metadata,
          consumed: true,
          original_reserved: bookGen.credits_reserved,
        },
        environment: environment,
      });

    if (logError) {
      console.error("Error logging consumption:", logError);
    }

    const balanceResult = await checkBalance(supabase, user_id, environment);
    return {
      success: true,
      balance: balanceResult.balance,
      transaction_id: book_generation_id,
    };
  } catch (error) {
    console.error("Error in consumeCredits:", error);
    return {
      success: false,
      error: "Failed to consume credits",
    };
  }
}

// Refund credits (called when generation fails)
async function refundCredits(
  supabase,
  user_id,
  book_generation_id,
  description,
  metadata,
  environment
) {
  try {
    // Get book generation details
    const { data: bookGen, error: bookError } = await supabase
      .from("book_generations")
      .select("credits_reserved, status")
      .eq("id", book_generation_id)
      .eq("environment", environment)
      .single();

    if (bookError || !bookGen) {
      return {
        success: false,
        error: "Book generation not found",
      };
    }

    if (bookGen.credits_reserved === 0) {
      return {
        success: false,
        error: "No credits to refund",
      };
    }

    // Refund the credits
    const { data: updateResult, error: updateError } = await supabase.rpc(
      "update_user_credits",
      {
        p_user_id: user_id,
        p_amount: bookGen.credits_reserved,
        p_operation: "refund",
        p_reference_id: book_generation_id,
        p_reference_type: "book_generation",
        p_description:
          description ||
          `Refunded ${bookGen.credits_reserved} credits for failed book generation`,
        p_metadata: {
          ...metadata,
          refunded: true,
          original_reserved: bookGen.credits_reserved,
        },
        p_environment: environment,
      }
    );

    if (updateError || !updateResult) {
      console.error("Error refunding credits:", updateError);
      return {
        success: false,
        error: "Failed to refund credits",
      };
    }

    // Update book generation as failed
    const { error: bookUpdateError } = await supabase
      .from("book_generations")
      .update({
        status: "failed",
        completed_at: new Date().toISOString(),
        error_message: metadata?.error_message || "Generation failed",
      })
      .eq("id", book_generation_id)
      .eq("environment", environment);

    if (bookUpdateError) {
      console.error("Error updating book generation:", bookUpdateError);
    }

    const balanceResult = await checkBalance(supabase, user_id, environment);
    return {
      success: true,
      balance: balanceResult.balance,
      transaction_id: book_generation_id,
    };
  } catch (error) {
    console.error("Error in refundCredits:", error);
    return {
      success: false,
      error: "Failed to refund credits",
    };
  }
}

// Refill monthly credits based on subscription
async function refillMonthlyCredits(supabase, user_id, environment) {
  try {
    console.log("🔍 Starting credit refill for user:", user_id);
    console.log("🌍 Environment:", environment);

    // First, let's see ALL subscriptions for this user
    const { data: allSubs, error: allSubsError } = await supabase
      .from("subscriptions")
      .select("price_id, status, subscription_id, created_at")
      .eq("user_id", user_id)
      .eq("environment", environment);

    console.log("📋 All subscriptions for user:", allSubs);

    // Get user's current subscription
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("price_id, status")
      .eq("user_id", user_id)
      .eq("status", "active")
      .eq("environment", environment)
      .single();

    console.log("🔍 Active subscription query result:", {
      subscription,
      subError,
    });

    if (subError || !subscription) {
      console.log("❌ No active subscription found. Error:", subError);
      console.log("❌ Available subscriptions:", allSubs);
      return {
        success: false,
        error: "No active subscription found",
      };
    }

    console.log("✅ Found active subscription:", subscription);
    console.log(
      "🔍 Looking for subscription plan with price_id:",
      subscription.price_id
    );

    // First check all available plans
    const { data: allPlans } = await supabase
      .from("subscription_plans")
      .select("name, price_id, monthly_credits")
      .eq("environment", environment);
    console.log("📋 All available subscription plans:", allPlans);

    // Get subscription plan details
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("monthly_credits")
      .eq("price_id", subscription.price_id)
      .eq("environment", environment)
      .single();

    console.log("📋 Plan query result:", { plan, planError });

    if (planError || !plan) {
      console.log("❌ No plan found for price_id:", subscription.price_id);
      return {
        success: false,
        error: "Subscription plan not found",
      };
    }

    console.log("✅ Found subscription plan:", plan);

    // Get current balance
    const balanceResult = await checkBalance(supabase, user_id, environment);
    if (!balanceResult.success) {
      console.log("❌ Failed to check balance:", balanceResult);
      return balanceResult;
    }

    const currentBalance = balanceResult.balance || 0;
    const monthlyCredits = plan.monthly_credits;

    console.log("💰 Current balance:", currentBalance);
    console.log("💰 Monthly credits to add:", monthlyCredits);

    // Add the full monthly credits allocation
    const creditsToAdd = monthlyCredits;

    console.log("💰 Credits to add:", creditsToAdd);

    // Add the credits
    const { data: updateResult, error: updateError } = await supabase.rpc(
      "update_user_credits",
      {
        p_user_id: user_id,
        p_amount: creditsToAdd,
        p_operation: "earn",
        p_reference_id: crypto.randomUUID(),
        p_reference_type: "subscription_refill",
        p_description: `Monthly credit refill: ${creditsToAdd} credits`,
        p_metadata: {
          monthly_refill: true,
          plan_name: subscription.price_id,
          monthly_allocation: monthlyCredits,
        },
        p_environment: environment,
      }
    );

    console.log("💰 Credit update result:", { updateResult, updateError });

    if (updateError || !updateResult) {
      console.error("❌ Error refilling credits:", updateError);
      return {
        success: false,
        error: "Failed to refill credits",
      };
    }

    // Update last refill date
    const { error: userUpdateError } = await supabase
      .from("user_credits")
      .update({
        last_refill_date: new Date().toISOString(),
      })
      .eq("user_id", user_id)
      .eq("environment", environment);

    if (userUpdateError) {
      console.error("Error updating refill date:", userUpdateError);
    }

    return {
      success: true,
      balance: currentBalance + creditsToAdd,
      details: `Added ${creditsToAdd} credits`,
    };
  } catch (error) {
    console.error("Error in refillMonthlyCredits:", error);
    return {
      success: false,
      error: "Failed to refill credits",
    };
  }
}
