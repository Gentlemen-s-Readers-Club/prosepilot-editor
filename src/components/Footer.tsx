import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-brand-primary border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-md bg-white p-2">
              <img src="/logo.png" alt="ProsePilot Logo" className="h-9 w-9" />
            </div>
            <span className="ml-2 text-xl font-bold text-white font-heading">
              ProsePilot
            </span>
          </div>
          <div className="flex flex-wrap gap-y-4 gap-x-6">
            <Link
              to="/pricing"
              className="text-brand-secondary hover:text-white text-sm transition-colors font-copy"
            >
              Pricing
            </Link>
            <Link
              to="/support"
              className="text-brand-secondary hover:text-white text-sm transition-colors font-copy"
            >
              Support
            </Link>
            <Link
              to="/docs"
              className="text-brand-secondary hover:text-white text-sm transition-colors font-copy"
            >
              Documentation
            </Link>
            <Link
              to="/privacy-policy"
              className="text-brand-secondary hover:text-white text-sm transition-colors font-copy"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-brand-secondary hover:text-white text-sm transition-colors font-copy"
            >
              Terms of Service
            </Link>
            <Link
              to="/login"
              className="text-brand-secondary hover:text-white text-sm transition-colors font-copy"
            >
              Login
            </Link>
          </div>
          <p className="text-brand-secondary text-sm mt-4 md:mt-0 font-copy">
            © 2025 ProsePilot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
