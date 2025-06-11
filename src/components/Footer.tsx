import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-brand-primary border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className='flex items-center justify-center rounded-md bg-white p-2'>
                <img src="/logo.png" alt="ProsePilot Logo" className="h-9 w-9" />
              </div>
              <span className="ml-2 text-xl font-bold text-white">ProsePilot</span> 
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/pricing" className="text-brand-secondary hover:text-white text-sm transition-colors">
                Pricing
              </Link>
              <Link to="/support" className="text-brand-secondary hover:text-white text-sm transition-colors">
                Support
              </Link>
              <Link to="/docs" className="text-brand-secondary hover:text-white text-sm transition-colors">
                Documentation
              </Link>
              <Link to="/privacy-policy" className="text-brand-secondary hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/app/login" className="text-brand-secondary hover:text-white text-sm transition-colors">
                Login
              </Link>
              <p className="text-brand-secondary text-sm">© 2025 ProsePilot. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;