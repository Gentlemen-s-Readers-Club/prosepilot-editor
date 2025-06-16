import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreditOperation {
  action: "reserve" | "consume" | "refund" | "check_balance" | "refill_monthly";
  user_id: string;
  amount?: number;
  book_generation_id?: string;
  description?: string;
  metadata?: Record<string, any>;
}

interface CreditResponse {
  success: boolean;
  balance?: number;
  transaction_id?: string;
  error?: string;
  details?: string;
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const operation: CreditOperation = await req.json();
    const {
      action,
      user_id,
      amount,
      book_generation_id,
      description,
      metadata,
    } = operation;

    // Validate required fields
    if (!action || !user_id) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let response: CreditResponse;

    switch (action) {
      case "check_balance":
        response = await checkBalance(supabase, user_id);
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
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        response = await reserveCredits(
          supabase,
          user_id,
          amount,
          book_generation_id,
          description,
          metadata
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
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        response = await consumeCredits(
          supabase,
          user_id,
          book_generation_id,
          description,
          metadata
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
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        response = await refundCredits(
          supabase,
          user_id,
          book_generation_id,
          description,
          metadata
        );
        break;

      case "refill_monthly":
        response = await refillMonthlyCredits(supabase, user_id);
        break;

      default:
        return new Response(
          JSON.stringify({ success: false, error: "Invalid action" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }

    return new Response(JSON.stringify(response), {
      status: response.success ? 200 : 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Check user's current credit balance
async function checkBalance(
  supabase: any,
  user_id: string
): Promise<CreditResponse> {
  try {
    const { data, error } = await supabase.rpc("get_user_credits", {
      p_user_id: user_id,
    });

    if (error) {
      console.error("Error checking balance:", error);
      return { success: false, error: "Failed to check balance" };
    }

    return { success: true, balance: data || 0 };
  } catch (error) {
    console.error("Error in checkBalance:", error);
    return { success: false, error: "Failed to check balance" };
  }
}

// Reserve credits for book generation (called when generation starts)
async function reserveCredits(
  supabase: any,
  user_id: string,
  amount: number,
  book_generation_id: string,
  description?: string,
  metadata?: Record<string, any>
): Promise<CreditResponse> {
  try {
    // Start a transaction
    const { data: updateResult, error: updateError } = await supabase.rpc(
      "update_user_credits",
      {
        p_user_id: user_id,
        p_amount: -amount,
        p_transaction_type: "consume",
        p_reference_id: book_generation_id,
        p_reference_type: "book_generation",
        p_description:
          description || `Reserved ${amount} credits for book generation`,
        p_metadata: { ...metadata, reserved: true },
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
      })
      .eq("id", book_generation_id);

    if (bookError) {
      console.error("Error updating book generation:", bookError);
      // Note: Credits are already deducted, but we log this for manual review
    }

    // Get updated balance
    const balanceResult = await checkBalance(supabase, user_id);

    return {
      success: true,
      balance: balanceResult.balance,
      transaction_id: book_generation_id,
    };
  } catch (error) {
    console.error("Error in reserveCredits:", error);
    return { success: false, error: "Failed to reserve credits" };
  }
}

// Consume reserved credits (called when generation completes successfully)
async function consumeCredits(
  supabase: any,
  user_id: string,
  book_generation_id: string,
  description?: string,
  metadata?: Record<string, any>
): Promise<CreditResponse> {
  try {
    // Get book generation details
    const { data: bookGen, error: bookError } = await supabase
      .from("book_generations")
      .select("credits_reserved, status")
      .eq("id", book_generation_id)
      .single();

    if (bookError || !bookGen) {
      return { success: false, error: "Book generation not found" };
    }

    // Update book generation as completed
    const { error: updateError } = await supabase
      .from("book_generations")
      .update({
        status: "completed",
        credits_consumed: bookGen.credits_reserved,
        completed_at: new Date().toISOString(),
      })
      .eq("id", book_generation_id);

    if (updateError) {
      console.error("Error updating book generation:", updateError);
      return { success: false, error: "Failed to update book generation" };
    }

    // Log the consumption (credits were already deducted during reservation)
    const { error: logError } = await supabase
      .from("credit_transactions")
      .insert({
        user_id,
        transaction_type: "consume",
        amount: 0, // No additional deduction, just logging
        balance_before: 0, // Will be updated by trigger
        balance_after: 0, // Will be updated by trigger
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
      });

    if (logError) {
      console.error("Error logging consumption:", logError);
    }

    const balanceResult = await checkBalance(supabase, user_id);

    return {
      success: true,
      balance: balanceResult.balance,
      transaction_id: book_generation_id,
    };
  } catch (error) {
    console.error("Error in consumeCredits:", error);
    return { success: false, error: "Failed to consume credits" };
  }
}

// Refund credits (called when generation fails)
async function refundCredits(
  supabase: any,
  user_id: string,
  book_generation_id: string,
  description?: string,
  metadata?: Record<string, any>
): Promise<CreditResponse> {
  try {
    // Get book generation details
    const { data: bookGen, error: bookError } = await supabase
      .from("book_generations")
      .select("credits_reserved, status")
      .eq("id", book_generation_id)
      .single();

    if (bookError || !bookGen) {
      return { success: false, error: "Book generation not found" };
    }

    if (bookGen.credits_reserved === 0) {
      return { success: false, error: "No credits to refund" };
    }

    // Refund the credits
    const { data: updateResult, error: updateError } = await supabase.rpc(
      "update_user_credits",
      {
        p_user_id: user_id,
        p_amount: bookGen.credits_reserved,
        p_transaction_type: "refund",
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
      }
    );

    if (updateError || !updateResult) {
      console.error("Error refunding credits:", updateError);
      return { success: false, error: "Failed to refund credits" };
    }

    // Update book generation as failed
    const { error: bookUpdateError } = await supabase
      .from("book_generations")
      .update({
        status: "failed",
        completed_at: new Date().toISOString(),
        error_message: metadata?.error_message || "Generation failed",
      })
      .eq("id", book_generation_id);

    if (bookUpdateError) {
      console.error("Error updating book generation:", bookUpdateError);
    }

    const balanceResult = await checkBalance(supabase, user_id);

    return {
      success: true,
      balance: balanceResult.balance,
      transaction_id: book_generation_id,
    };
  } catch (error) {
    console.error("Error in refundCredits:", error);
    return { success: false, error: "Failed to refund credits" };
  }
}

// Refill monthly credits based on subscription
async function refillMonthlyCredits(
  supabase: any,
  user_id: string
): Promise<CreditResponse> {
  try {
    // Get user's current subscription
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("price_id, status")
      .eq("user_id", user_id)
      .eq("status", "active")
      .single();

    if (subError || !subscription) {
      return { success: false, error: "No active subscription found" };
    }

    // Get subscription plan details
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("monthly_credits, max_credits")
      .eq("price_id", subscription.price_id)
      .single();

    if (planError || !plan) {
      return { success: false, error: "Subscription plan not found" };
    }

    // Get current balance
    const balanceResult = await checkBalance(supabase, user_id);
    if (!balanceResult.success) {
      return balanceResult;
    }

    const currentBalance = balanceResult.balance || 0;
    const maxCredits = plan.max_credits;
    const monthlyCredits = plan.monthly_credits;

    // Calculate credits to add (respect max_credits limit)
    let creditsToAdd = monthlyCredits;
    if (maxCredits && currentBalance + creditsToAdd > maxCredits) {
      creditsToAdd = Math.max(0, maxCredits - currentBalance);
    }

    if (creditsToAdd === 0) {
      return {
        success: true,
        balance: currentBalance,
        details: "Already at maximum credits",
      };
    }

    // Add the credits
    const { data: updateResult, error: updateError } = await supabase.rpc(
      "update_user_credits",
      {
        p_user_id: user_id,
        p_amount: creditsToAdd,
        p_transaction_type: "earn",
        p_reference_type: "subscription_refill",
        p_description: `Monthly credit refill: ${creditsToAdd} credits`,
        p_metadata: {
          monthly_refill: true,
          plan_name: subscription.price_id,
          max_credits: maxCredits,
          monthly_allocation: monthlyCredits,
        },
      }
    );

    if (updateError || !updateResult) {
      console.error("Error refilling credits:", updateError);
      return { success: false, error: "Failed to refill credits" };
    }

    // Update last refill date
    const { error: userUpdateError } = await supabase
      .from("user_credits")
      .update({ last_refill_date: new Date().toISOString() })
      .eq("user_id", user_id);

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
    return { success: false, error: "Failed to refill credits" };
  }
}
