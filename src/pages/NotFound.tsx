import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Footer from '../components/Footer';
import { SEOHead } from '../components/SEOHead';

export function NotFound() {
  return (
    <>
      <SEOHead 
        title="Page Not Found - ProsePilot" 
        description="Sorry, we couldn't find the page you're looking for. Navigate back to our homepage or explore our help resources."
      />
      
      <div className="min-h-screen bg-base-background flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-9xl font-bold text-brand-accent/20 font-heading">404</h1>
            </div>

            {/* Main Message */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-4">
                Page not found
              </h2>
              <p className="text-lg text-base-paragraph font-copy mb-8">
                Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
              </p>
              <div className="space-y-4">
                <Link to="/">
                  <Button className="w-full sm:w-auto">
                    Go back home
                  </Button>
                </Link>
                <div className="text-sm text-base-paragraph font-copy">
                  <p>Or try one of these popular pages:</p>
                  <div className="mt-2 space-y-2">
                    <Link to="/signup" className="block text-brand-accent hover:text-brand-accent/80 font-copy">
                      Start writing your book
                    </Link>
                    <Link to="/help" className="block text-brand-accent hover:text-brand-accent/80 font-copy">
                      Help & documentation
                    </Link>
                    <Link to="/pricing" className="block text-brand-accent hover:text-brand-accent/80 font-copy">
                      View pricing plans
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Additional Help Section */}
      <div className="bg-base-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-base-heading font-heading mb-4">
              Still can't find what you're looking for?
            </h3>
            <p className="text-base-paragraph font-copy mb-6">
              Our support team is here to help you get back on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/support">
                <Button variant="outline">
                  Contact Support
                </Button>
              </Link>
              <Link to="/help">
                <Button variant="outline">
                  Browse Help Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 