import { supabase } from "../lib/supabase";

// Track users currently being processed to prevent duplicates
const processingUsers = new Set<string>();

// Utility function to check and create Paddle customer for new users
export const checkAndCreatePaddleCustomer = async (session: any) => {
  if (!session?.user) return;
  
  const userId = session.user.id;
  
  // Prevent duplicate processing for the same user
  if (processingUsers.has(userId)) {
    console.log("⏸️ Already processing user:", userId);
    return;
  }
  
  processingUsers.add(userId);
  console.log("🔍 Checking if user needs Paddle setup:", userId);

  try {
    // Check if user already has credits initialized
    console.log("🔍 Checking if user already has credits initialized:", session.user.id);
    const { data: userCredits, error: creditsError } = await supabase
      .from('user_credits')
      .select('current_balance')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (creditsError) {
      console.error("❌ Error checking user credits:", creditsError);
      return;
    }

    // If user doesn't have credits initialized, create Paddle customer and initialize credits
    if (!userCredits) {
      console.log("🔔 Creating Paddle customer for new user");

      // Get the current session to ensure we have a valid token
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        console.error("❌ No valid session found");
        return;
      }

      // Call the Edge Function to create Paddle customer and initialize credits
      const { data, error } = await supabase.functions.invoke(
        "handle-user-created",
        {
          headers: {
            Authorization: `Bearer ${currentSession.access_token}`,
          },
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
  } finally {
    // Always remove user from processing set when done
    processingUsers.delete(userId);
  }
};

export const useNewUserHandler = () => {
  // This hook is now empty - new user handling is done via direct function calls
  // at specific points in the user journey (login success, signup success, etc.)
};
