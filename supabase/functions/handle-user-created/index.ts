import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Paddle } from "npm:@paddle/paddle-node-sdk@1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const paddleClient = new Paddle(Deno.env.get("PADDLE_API_KEY")!, {
  environment:
    Deno.env.get("PADDLE_ENVIRONMENT") === "production"
      ? "production"
      : "sandbox",
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { record } = await req.json();
    console.log("📥 Processing user:", record);

    if (!record?.id || !record?.email) {
      return new Response(
        JSON.stringify({ error: "Missing required user data" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create a customer in Paddle
    const customer = await paddleClient.customers.create({
      email: record.email,
      name: record.raw_user_meta_data?.full_name || record.email.split("@")[0],
    });

    if (!customer?.data?.id) {
      throw new Error("Failed to create Paddle customer");
    }

    console.log("✅ Created Paddle customer:", customer.data.id);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create profile with Paddle customer ID
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .insert({
        id: record.id,
        email: record.email,
        paddle_customer_id: customer.data.id,
      });

    if (profileError) {
      console.error("❌ Error creating profile:", profileError);
      throw new Error("Failed to create profile with Paddle customer ID");
    }

    // Initialize user credits
    const { error: creditsError } = await supabaseClient
      .from("user_credits")
      .insert({
        user_id: record.id,
        current_balance: 0,
        total_earned: 0,
        total_consumed: 0,
      });

    if (creditsError) {
      console.error("❌ Error initializing user credits:", creditsError);
      throw new Error("Failed to initialize user credits");
    }

    return new Response(
      JSON.stringify({
        message: "Successfully created Paddle customer and initialized user",
        customerId: customer.data.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Error in handle-user-created function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
