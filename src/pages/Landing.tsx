import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  PenTool, 
  Brain,
  ChevronRight,
  Star,
  Users,
  Zap,
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  Play,
  Quote
} from 'lucide-react';
import { Button } from '../components/ui/button';

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src="/logo.png" alt="ProsePilot Logo" className="h-12 w-12" />
              <span className="ml-2 text-xl font-bold text-primary">ProsePilot</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/pricing"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/support"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Support
              </Link>
              <Link
                to="/docs"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                How It Works
              </Link>
              <Link
                to="/app/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Log in
              </Link>
              <Link to="/app/signup">
                <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center lg:text-left lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-6">
                  {/* Social Proof Badge */}
                  <div className="inline-flex items-center bg-white rounded-full px-4 py-2 mb-6 shadow-sm border">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Trusted by 50,000+ writers</span>
                    <span className="ml-2 text-sm text-gray-500">• 4.9/5 rating</span>
                  </div>

                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                    <span className="block">Write your book in</span>
                    <span className="block text-primary">days, not years</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl sm:max-w-xl sm:mx-auto md:mt-5 lg:mx-0">
                    Stop staring at blank pages. ProsePilot's AI transforms your ideas into compelling, 
                    publication-ready books faster than you ever thought possible.
                  </p>

                  {/* Key Benefits */}
                  <div className="mt-6 space-y-3">
                    {[
                      "Generate complete books from simple prompts",
                      "Professional editing and formatting included",
                      "Export to all major publishing formats"
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link to="/app/signup">
                        <Button className="w-full flex items-center justify-center px-8 py-4 text-lg font-medium bg-primary hover:bg-primary/90">
                          Start Writing Your Book
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-6 text-sm text-gray-500">
                    {/* <span>✓ 30-day money-back guarantee</span>
                    <span className="mx-3">•</span> */}
                    <span>✓ Cancel anytime</span>
                    <span className="mx-3">•</span>
                    <span>✓ Start from just $9/month</span>
                  </div>
                </div>

                <div className="mt-12 lg:mt-0 lg:col-span-6">
                  <div className="relative">
                    <img
                      className="w-full rounded-lg shadow-2xl"
                      src="https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      alt="Writer using ProsePilot interface"
                    />
                    {/* Floating Stats */}
                    <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 border">
                      <div className="flex items-center">
                        <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-gray-900">1M+</div>
                          <div className="text-sm text-gray-500">Books Created</div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-lg p-4 border">
                      <div className="flex items-center">
                        <Clock className="w-8 h-8 text-blue-500 mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-gray-900">72hrs</div>
                          <div className="text-sm text-gray-500">Avg. Completion</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Problem/Solution Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Stop letting your book ideas die in drafts
              </h2>
              <div className="mt-6 space-y-6">
                {[
                  {
                    problem: "Spending months on outlines that go nowhere",
                    solution: "AI creates detailed, engaging outlines in minutes"
                  },
                  {
                    problem: "Struggling with writer's block and blank pages",
                    solution: "Never face a blank page again with intelligent content generation"
                  },
                  {
                    problem: "Worrying about plot holes and character consistency",
                    solution: "Built-in consistency checking ensures professional quality"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-100">
                        <span className="text-red-600 font-bold">✗</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 line-through opacity-60">
                        {item.problem}
                      </h3>
                      <div className="flex items-center mt-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <p className="text-base text-green-700 font-medium">{item.solution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <img
                className="w-full rounded-lg shadow-lg"
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Frustrated writer at desk"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Everything You Need</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              From idea to published book in record time
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our AI-powered platform handles the heavy lifting so you can focus on your creativity.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {[
                {
                  icon: <Sparkles className="h-8 w-8" />,
                  title: "AI Story Generation",
                  description: "Transform simple prompts into rich, engaging narratives with advanced AI that understands storytelling.",
                  benefits: ["Complete plot development", "Character arc creation", "Dialogue generation"]
                },
                {
                  icon: <PenTool className="h-8 w-8" />,
                  title: "Professional Editor",
                  description: "Write and refine your story with our intuitive editor that includes real-time suggestions and formatting.",
                  benefits: ["Grammar & style checking", "Consistency validation", "Format optimization"]
                },
                {
                  icon: <Brain className="h-8 w-8" />,
                  title: "Smart Organization",
                  description: "Keep your story structured with intelligent chapter management and plot tracking tools.",
                  benefits: ["Chapter organization", "Plot hole detection", "Character tracking"]
                }
              ].map((feature, index) => (
                <div key={index} className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#EBFAFD] text-primary mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Join thousands of successful authors
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              See what writers are saying about their ProsePilot experience
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                quote: "I went from idea to published novel in just 3 weeks. ProsePilot didn't just help me write—it helped me become a real author.",
                author: "Sarah Chen",
                role: "Romance Novelist",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                achievement: "Published 3 bestsellers"
              },
              {
                quote: "The AI understood my vision better than I did. It helped me develop plot threads I never would have thought of on my own.",
                author: "Marcus Rodriguez",
                role: "Sci-Fi Author",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                achievement: "Amazon #1 New Release"
              },
              {
                quote: "Finally, a tool that gets writers. The collaborative features helped my writing group finish our anthology in record time.",
                author: "Emily Watson",
                role: "Writing Group Leader",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                achievement: "Led 50+ writers to publication"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-8 relative">
                <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
                <div className="relative">
                  <p className="text-gray-700 text-lg italic mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-primary font-medium">{testimonial.achievement}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { number: "50K+", label: "Active Writers" },
              { number: "1M+", label: "Books Created" },
              { number: "4.9/5", label: "User Rating" },
              { number: "72hrs", label: "Avg. Completion" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary">{stat.number}</div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Start writing today, publish tomorrow
          </h2>
          <p className="mt-4 text-xl text-white/90">
            Choose the plan that fits your writing goals
          </p>
          
          <div className="mt-8">
            <Link to="/pricing">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                View All Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-accent rounded-lg shadow-xl overflow-hidden">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Your book is waiting.</span>
                  <span className="block">Start writing it today.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-white/90">
                  Don't let another year pass with your story untold. Join 50,000+ writers who've 
                  transformed their ideas into published books with ProsePilot.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/app/signup"
                    className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-primary bg-white hover:bg-gray-50 transition-colors"
                  >
                    Start Your Writing Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/docs"
                    className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white/10 transition-colors"
                  >
                    See How It Works
                  </Link>
                </div>
                <div className="mt-6 flex items-center text-white/80">
                  <Award className="w-5 h-5 mr-2" />
                  <span className="text-sm">30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="/logo.png" alt="ProsePilot Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-white">ProsePilot</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">
                Pricing
              </Link>
              <Link to="/support" className="text-gray-400 hover:text-white text-sm transition-colors">
                Support
              </Link>
              <Link to="/docs" className="text-gray-400 hover:text-white text-sm transition-colors">
                Documentation
              </Link>
              <Link to="/app/login" className="text-gray-400 hover:text-white text-sm transition-colors">
                Login
              </Link>
              <p className="text-gray-400 text-sm">© 2025 ProsePilot. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}