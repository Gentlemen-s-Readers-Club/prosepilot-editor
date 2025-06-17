import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '../components/ui/button';
import { Home, Search, BookOpen, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';

export function NotFound() {
  const { session } = useAuth();

  return (
    <>
      <Helmet>
        <title>Page Not Found - ProsePilot</title>
      </Helmet>
      
      <div className="min-h-screen bg-base-background flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-9xl font-bold text-brand-accent/20">404</h1>
            </div>

            {/* Main Message */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-base-heading mb-4">
                Page Not Found
              </h2>
              <p className="text-lg text-base-paragraph">
                Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mb-12">
              <Link to="/">
                <Button className="w-full py-3">
                  <Home className="mr-2 h-5 w-5" />
                  Go to Homepage
                </Button>
              </Link>
              
              {session && (
                <Link to="/workspace">
                  <Button variant="outline" className="w-full py-3">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>

            {/* Helpful Links */}
            <div className="border-t border-base-border pt-8">
              <h3 className="text-lg font-semibold text-base-heading mb-4">
                Looking for something specific?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                  to="/docs"
                  className="flex items-center justify-center p-3 rounded-lg border border-base-border hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-colors"
                >
                  <Search className="mr-2 h-4 w-4 text-brand-accent" />
                  <span className="text-sm font-medium text-base-paragraph">Documentation</span>
                </Link>
                <Link 
                  to="/support"
                  className="flex items-center justify-center p-3 rounded-lg border border-base-border hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-colors"
                >
                  <span className="text-sm font-medium text-base-paragraph">Get Support</span>
                  <ArrowRight className="ml-2 h-4 w-4 text-brand-accent" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
} 