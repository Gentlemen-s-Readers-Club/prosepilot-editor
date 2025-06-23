import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Dashboard } from "./pages/Dashboard";
import { BookDetails } from "./pages/BookDetails";
import { ChapterEditor } from "./pages/ChapterEditor";
import { EditProfile } from "./pages/EditProfile";
import { Subscription } from "./pages/Subscription";
import { Documentation } from "./pages/Documentation";
import { Teams } from "./pages/Teams";
import { TeamDetails } from "./pages/TeamDetails";
import { Landing } from "./pages/Landing";
import { Pricing } from "./pages/Pricing";
import { Support } from "./pages/Support";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";
import { NotFound } from "./pages/NotFound";
import { Toaster } from "./components/Toaster";
import { ScrollToTop } from "./components/ScrollToTop";
import { AppDispatch, RootState } from "./store";
import { useDispatch, useSelector } from "react-redux";
import { setSession } from './store/slices/authSlice';
import { fetchProfile } from "./store/slices/profileSlice";
import {
  fetchUserSubscription,
  setupRealtimeSubscriptions,
  clearRealtimeSubscription,
  hasStudioPlan,
} from "./store/slices/subscriptionSlice";
import { PaddleProvider } from "./contexts/PaddleContext";

// Help Articles
import { CreateFirstBook } from "./pages/help/CreateFirstBook";
import { CreditSystem } from "./pages/help/CreditSystem";
import { AIBestPractices } from "./pages/help/AIBestPractices";
import { TeamCollaboration } from "./pages/help/TeamCollaboration";
import { Navigation } from "./components/Navigation";
import { supabase } from "./lib/supabase";
import { checkAndCreatePaddleCustomer } from "./hooks/useNewUserHandler";

// Shared Loading Component
function LoadingSpinner({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

// Protected Route For Anonymous Users
function AnonymousRoute({ children }: { children: React.ReactNode }) {
  const { session } = useSelector((state: RootState) => (state.auth));

  return session ? <Navigate to="/workspace" /> : <>{children}</>;
}

// Protected Route For Logged In Users
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useSelector((state: RootState) => (state.auth));

  return !session ? <Navigate to="/login" /> : <>{children}</>;
}

// Protected Route Component for Studio Plan
function StudioProtectedRoute({ children }: { children: React.ReactNode }) {
  const hasStudio = useSelector(hasStudioPlan);
  const { status: subscriptionStatus } = useSelector(
    (state: RootState) => state.subscription
  );

  // Show loading while subscription data is being fetched or if it hasn't been fetched yet
  if (subscriptionStatus === "loading" || subscriptionStatus === "idle") {
    return <LoadingSpinner message="Checking subscription..." />;
  }

  // If there was an error loading subscription data, still allow access
  // This prevents users from being locked out due to temporary API issues
  if (subscriptionStatus === "error") {
    console.warn(
      "Subscription data failed to load, allowing access to prevent lockout"
    );
    return <>{children}</>;
  }

  // Only redirect if subscription data has been successfully loaded and user doesn't have Studio plan
  if (subscriptionStatus === "success" && !hasStudio) {
    return <Navigate to="/workspace/subscription" replace />;
  }

  return <>{children}</>;
}

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { session } = useSelector((state: RootState) => (state.auth));
  const { profile } = useSelector((state: RootState) => state.profile);
  const { status: subscriptionStatus } = useSelector(
    (state: RootState) => state.subscription
  );
  
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session))
    })
    return () => subscription.unsubscribe()
  }, [dispatch]);

  useEffect(() => {
    if (session && !profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, session, profile]);

  // Check for new users when session is first established (for OAuth redirects)
  useEffect(() => {
    if (session) {
      checkAndCreatePaddleCustomer(session);
    }
  }, [session]);

  useEffect(() => {
    if (session && subscriptionStatus === "idle") {
      dispatch(fetchUserSubscription());
    }
  }, [dispatch, session, subscriptionStatus]);

  // Set up real-time subscriptions when user is authenticated
  useEffect(() => {
    if (session) {
      dispatch(setupRealtimeSubscriptions());
    }

    // Clean up real-time subscription when component unmounts or session changes
    return () => {
      if (session) {
        dispatch(clearRealtimeSubscription());
      }
    };
  }, [dispatch, session]);

  return (
    <div className="bg-base-background pt-16 min-h-screen">
      <PaddleProvider>
        <Router>
          <ScrollToTop />
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/support" element={<Support />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />


              <Route  path="/login"
                element={<AnonymousRoute><Login /></AnonymousRoute>}
              />
              <Route path="/signup"
                element={<AnonymousRoute><Signup /></AnonymousRoute>}
              />
              <Route
                path="/forgot-password"
                element={
                  <AnonymousRoute><ForgotPassword /></AnonymousRoute>
                }
              />
              <Route
                path="/reset-password"
                element={session ? <ResetPassword /> : <Navigate to="/login" />}
              />

              {/* Help Articles */}
              <Route
                path="/help/create-first-book"
                element={<CreateFirstBook />}
              />
              <Route path="/help/credit-system" element={<CreditSystem />} />
              <Route
                path="/help/ai-best-practices"
                element={<AIBestPractices />}
              />
              <Route
                path="/help/team-collaboration"
                element={<TeamCollaboration />}
              />

              <Route
                path="/workspace"
                element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                }
              />

              <Route
                path="/workspace/book/:id"
                element={
                  <ProtectedRoute><BookDetails /></ProtectedRoute>
                }
              />
              <Route
                path="/workspace/chapter/:id"
                element={
                  <ProtectedRoute><ChapterEditor /></ProtectedRoute>
                }
              />
              <Route
                path="/workspace/profile"
                element={
                  <ProtectedRoute><EditProfile /></ProtectedRoute>
                }
              />
              <Route
                path="/workspace/subscription"
                element={
                  <ProtectedRoute><Subscription /></ProtectedRoute>
                }
              />

              {/* Studio Plan Protected Routes */}
              <Route
                path="/workspace/teams"
                element={
                  <ProtectedRoute><StudioProtectedRoute><Teams /></StudioProtectedRoute></ProtectedRoute>
                }
              />
              <Route
                path="/workspace/teams/:teamId"
                element={
                  <ProtectedRoute><StudioProtectedRoute><TeamDetails /></StudioProtectedRoute></ProtectedRoute>
                }
              />

              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Toaster />
        </Router>
      </PaddleProvider>
    </div>
  );
}

export default App;
