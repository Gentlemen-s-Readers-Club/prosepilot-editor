import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  PenTool, 
  Brain,
  ChevronRight,
  Star,
  Users,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/button';

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src="/logo.png" alt="ProsePilot Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-[#31606D]">ProsePilot</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/app/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Log in
              </Link>
              <Link to="/app/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Transform your ideas into</span>
                  <span className="block text-[#31606D]">captivating stories</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  ProsePilot is your AI-powered writing companion that helps you craft compelling narratives, develop rich characters, and bring your stories to life.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/signup">
                      <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium">
                        Start Writing Free
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.pexels.com/photos/3059747/pexels-photo-3059747.jpeg"
            alt="Writer working on story"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-[#31606D] font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to write your next masterpiece
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#EBFAFD] text-[#31606D]">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">AI-Powered Assistance</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Get intelligent suggestions for plot development, character arcs, and dialogue enhancement.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#EBFAFD] text-[#31606D]">
                  <PenTool className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">Rich Text Editor</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Write and format your story with our intuitive, distraction-free editor.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#EBFAFD] text-[#31606D]">
                  <Brain className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">Story Structure</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Organize your narrative with powerful tools for plotting and chapter management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-[#EBFAFD] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="flex flex-col items-center">
              <Star className="h-12 w-12 text-[#31606D]" />
              <p className="mt-4 text-5xl font-extrabold text-[#31606D]">4.9/5</p>
              <p className="mt-2 text-lg text-gray-600">Average Rating</p>
            </div>

            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-[#31606D]" />
              <p className="mt-4 text-5xl font-extrabold text-[#31606D]">50K+</p>
              <p className="mt-2 text-lg text-gray-600">Active Writers</p>
            </div>

            <div className="flex flex-col items-center">
              <Zap className="h-12 w-12 text-[#31606D]" />
              <p className="mt-4 text-5xl font-extrabold text-[#31606D]">1M+</p>
              <p className="mt-2 text-lg text-gray-600">Stories Created</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-[#31606D] rounded-lg shadow-xl overflow-hidden">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Ready to start your journey?</span>
                  <span className="block">Begin writing your story today.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-white/80">
                  Join thousands of writers who trust ProsePilot to bring their stories to life.
                </p>
                <Link
                  to="/signup"
                  className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#31606D] bg-white hover:bg-gray-50"
                >
                  Get Started Free
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="/logo.png" alt="ProsePilot Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-[#31606D]">ProsePilot</span>
            </div>
            <p className="text-gray-500 text-sm">© 2025 ProsePilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}