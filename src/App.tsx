import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { BookDetails } from './pages/BookDetails';
import { ChapterEditor } from './pages/ChapterEditor';
import { EditProfile } from './pages/EditProfile';
import { Subscription } from './pages/Subscription';
import { Landing } from './pages/Landing';
import { Toaster } from './components/Toaster';
import { useAuth } from './hooks/useAuth';

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/app"
            element={
              session ? (
                <Dashboard />
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
            element={session ? <ChapterEditor /> : <Navigate to="/app/login" />}
          />
          <Route
            path="/app/profile"
            element={session ? <EditProfile /> : <Navigate to="/app/login" />}
          />
          <Route
            path="/app/subscription"
            element={session ? <Subscription /> : <Navigate to="/app/login" />}
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
  );
}

export default App;