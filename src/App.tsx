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
import { Toaster } from "./components/Toaster";
import { ScrollToTop } from "./components/ScrollToTop";
import { useAuth } from "./hooks/useAuth";
import { AppDispatch, RootState } from "./store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "./store/slices/profileSlice";
import { fetchSubscriptions, setupRealtimeSubscriptions, clearRealtimeSubscription, hasStudioPlan } from "./store/slices/subscriptionSlice";
import { PaddleProvider } from "./contexts/PaddleContext";

// Help Articles
import { CreateFirstBook } from "./pages/help/CreateFirstBook";
import { CreditSystem } from "./pages/help/CreditSystem";
import { AIBestPractices } from "./pages/help/AIBestPractices";
import { TeamCollaboration } from "./pages/help/TeamCollaboration";
import { Navigation } from "./components/Navigation";

// Protected Route Component for Studio Plan
function StudioProtectedRoute({ children }: { children: React.ReactNode }) {
  const hasStudio = useSelector(hasStudioPlan);
  const { status: subscriptionStatus } = useSelector((state: RootState) => state.subscription);

  // Show loading while subscription data is being fetched
  if (subscriptionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking subscription...</p>
        </div>
      </div>
    );
  }

  // Redirect to subscription page if user doesn't have Studio plan
  if (!hasStudio) {
    return <Navigate to="/app/subscription" replace />;
  }

  return <>{children}</>;
}

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { session, loading } = useAuth();
  const { profile } = useSelector((state: RootState) => state.profile);
  const { status: subscriptionStatus } = useSelector((state: RootState) => state.subscription);

  useEffect(() => {
    if (session && !profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, session, profile]);

  useEffect(() => {
    if (session && subscriptionStatus === 'idle') {
      dispatch(fetchSubscriptions());
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
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/support" element={<Support />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

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
              path="/app"
              element={session ? <Dashboard /> : <Navigate to="/app/login" />}
            />
            
            {/* Studio Plan Protected Routes */}
            <Route
              path="/app/teams"
              element={
                session ? (
                  <StudioProtectedRoute>
                    <Teams />
                  </StudioProtectedRoute>
                ) : (
                  <Navigate to="/app/login" />
                )
              }
            />
            <Route
              path="/app/teams/:teamId"
              element={
                session ? (
                  <StudioProtectedRoute>
                    <TeamDetails />
                  </StudioProtectedRoute>
                ) : (
                  <Navigate to="/app/login" />
                )
              }
            />
            
            <Route
              path="/app/book/:id"
              element={session ? <BookDetails /> : <Navigate to="/app/login" />}
            />
            <Route
              path="/app/chapter/:id"
              element={
                session ? <ChapterEditor /> : <Navigate to="/app/login" />
              }
            />
            <Route
              path="/app/profile"
              element={session ? <EditProfile /> : <Navigate to="/app/login" />}
            />
            <Route
              path="/app/subscription"
              element={
                session ? <Subscription /> : <Navigate to="/app/login" />
              }
            />
            <Route
              path="/app/login"
              element={session ? <Navigate to="/app" /> : <Login />}
            />
            <Route
              path="/app/signup"
              element={session ? <Navigate to="/app" /> : <Signup />}
            />
            <Route
              path="/app/forgot-password"
              element={session ? <Navigate to="/app" /> : <ForgotPassword />}
            />
          </Routes>
          <Toaster />
        </Router>
      </PaddleProvider>
    </div>
  );
}

export default App;