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
import { useAuth } from "./hooks/useAuth";
import { AppDispatch, RootState } from "./store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "./store/slices/profileSlice";
import {
  fetchUserSubscription,
  setupRealtimeSubscriptions,
  clearRealtimeSubscription,
  hasStudioPlan,
  selectHasActiveSubscription,
} from "./store/slices/subscriptionSlice";
import { PaddleProvider } from "./contexts/PaddleContext";

// Help Articles
import { CreateFirstBook } from "./pages/help/CreateFirstBook";
import { CreditSystem } from "./pages/help/CreditSystem";
import { AIBestPractices } from "./pages/help/AIBestPractices";
import { TeamCollaboration } from "./pages/help/TeamCollaboration";
import { Navigation } from "./components/Navigation";

// Shared Loading Component
function SubscriptionLoadingSpinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Checking subscription...</p>
      </div>
    </div>
  );
}

// Protected Route Component for Studio Plan
function StudioProtectedRoute({ children }: { children: React.ReactNode }) {
  const hasStudio = useSelector(hasStudioPlan);
  const { status: subscriptionStatus } = useSelector(
    (state: RootState) => state.subscription
  );

  // Show loading while subscription data is being fetched or if it hasn't been fetched yet
  if (subscriptionStatus === "loading" || subscriptionStatus === "idle") {
    return <SubscriptionLoadingSpinner />;
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

// Protected Route Component for Active Subscription
function SubscriptionProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasActiveSubscription = useSelector(selectHasActiveSubscription);
  const { status: subscriptionStatus } = useSelector(
    (state: RootState) => state.subscription
  );

  // Show loading while subscription data is being fetched or if it hasn't been fetched yet
  if (subscriptionStatus === "loading" || subscriptionStatus === "idle") {
    return <SubscriptionLoadingSpinner />;
  }

  // If there was an error loading subscription data, still allow access
  // This prevents users from being locked out due to temporary API issues
  if (subscriptionStatus === "error") {
    console.warn(
      "Subscription data failed to load, allowing access to prevent lockout"
    );
    return <>{children}</>;
  }

  // Only redirect if subscription data has been successfully loaded and user doesn't have an active subscription
  if (subscriptionStatus === "success" && !hasActiveSubscription) {
    return <Navigate to="/workspace/subscription" replace />;
  }

  return <>{children}</>;
}

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { session, loading } = useAuth();
  const { profile } = useSelector((state: RootState) => state.profile);
  const { status: subscriptionStatus } = useSelector(
    (state: RootState) => state.subscription
  );

  useEffect(() => {
    if (session && !profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, session, profile]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-base-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

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
                  session ? (
                    <SubscriptionProtectedRoute>
                      <Dashboard />
                    </SubscriptionProtectedRoute>
                  ) : (
                    <Navigate to="/workspace/login" />
                  )
                }
              />

              <Route
                path="/workspace/book/:id"
                element={
                  session ? (
                    <SubscriptionProtectedRoute>
                      <BookDetails />
                    </SubscriptionProtectedRoute>
                  ) : (
                    <Navigate to="/workspace/login" />
                  )
                }
              />
              <Route
                path="/workspace/chapter/:id"
                element={
                  session ? (
                    <SubscriptionProtectedRoute>
                      <ChapterEditor />
                    </SubscriptionProtectedRoute>
                  ) : (
                    <Navigate to="/workspace/login" />
                  )
                }
              />
              <Route
                path="/workspace/profile"
                element={
                  session ? <EditProfile /> : <Navigate to="/workspace/login" />
                }
              />
              <Route
                path="/workspace/subscription"
                element={
                  session ? (
                    <Subscription />
                  ) : (
                    <Navigate to="/workspace/login" />
                  )
                }
              />
              <Route
                path="/workspace/login"
                element={session ? <Navigate to="/workspace" /> : <Login />}
              />
              <Route
                path="/workspace/signup"
                element={session ? <Navigate to="/workspace" /> : <Signup />}
              />
              <Route
                path="/workspace/forgot-password"
                element={
                  session ? <Navigate to="/workspace" /> : <ForgotPassword />
                }
              />

              {/* Studio Plan Protected Routes */}
              <Route
                path="/workspace/teams"
                element={
                  session ? (
                    <StudioProtectedRoute>
                      <Teams />
                    </StudioProtectedRoute>
                  ) : (
                    <Navigate to="/workspace/login" />
                  )
                }
              />
              <Route
                path="/workspace/teams/:teamId"
                element={
                  session ? (
                    <StudioProtectedRoute>
                      <TeamDetails />
                    </StudioProtectedRoute>
                  ) : (
                    <Navigate to="/workspace/login" />
                  )
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
