import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useNewUserHandler = () => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only proceed if this is a sign in event and we have a session
        if (event === 'SIGNED_IN' && session?.user) {
          console.log("🔍 Checking if user needs Paddle setup:", session.user.id);

          try {
            // Check if user already has credits initialized
            const { data: userCredits, error: creditsError } = await supabase
              .from('user_credits')
              .select('current_balance')
              .eq('user_id', session.user.id)
              .single();

            if (creditsError && creditsError.code !== 'PGRST116') {
              // Only log real errors, not "no rows returned"
              console.error("❌ Error checking user credits:", creditsError);
              return;
            }

            // If user doesn't have credits initialized, create Paddle customer and initialize credits
            if (!userCredits) {
              console.log("🔔 Creating Paddle customer for new user");

              // Call the Edge Function to create Paddle customer and initialize credits
              const { data, error } = await supabase.functions.invoke(
                "handle-user-created",
                {
                  body: {
                    record: {
                      id: session.user.id,
                      email: session.user.email,
                      raw_user_meta_data: session.user.user_metadata
                    },
                  },
                }
              );

              if (error) {
                console.error("❌ Error calling handle-user-created function:", error);
                return;
              }

              console.log("✅ Successfully created Paddle customer and initialized credits:", data);
            } else {
              console.log("✅ User already has credits initialized");
            }
          } catch (error) {
            console.error("❌ Error processing user:", error);
          }
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
};
