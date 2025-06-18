import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  Sparkles, 
  PenTool, 
  Brain,
  Star,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Quote,
  Zap,
  Award,
  Target,
  Rocket
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { SubscribeForm } from '../components/SubscribeForm';
import Footer from '../components/Footer';

export function Landing() {
  return (
    <>
      <Helmet>
        <title>ProsePilot</title>
      </Helmet>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-base-background">
        {/* Bolt.new Logo Top Right */}
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2 right-2 lg:top-6 lg:right-6 z-20 rounded-full shadow-lg aspect-square"
          aria-label="Built with Bolt.new"
        >
          <img
            src="/black_circle_360x360.png"
            alt="Built with Bolt.new"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg border border-white"
          />
        </a>
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center lg:text-left lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-6">
                  {/* Social Proof Badge */}
                  <div className="inline-flex items-center bg-white rounded-full px-4 py-2 mb-6 shadow-sm border">
                    <Star className="w-4 h-4 text-brand-accent mr-2" />
                    <span className="text-sm font-medium text-base-heading">Trusted by 50,000+ writers</span>
                    <span className="ml-2 text-sm text-base-paragraph max-md:hidden">• 4.9/5 rating</span>
                  </div>

                  <h1 className="text-4xl tracking-tight font-extrabold text-base-heading sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                    <span className="block">Write your book in</span>
                    <span className="block text-brand-accent">days, not years</span>
                  </h1>
                  <p className="mt-3 text-base-paragraph sm:mt-5 sm:text-xl sm:max-w-xl sm:mx-auto md:mt-5 lg:mx-0">
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
                        <CheckCircle className="w-5 h-5 text-state-success mr-3" />
                        <span className="text-base-paragraph">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link to="/workspace/signup">
                        <Button className="w-full flex items-center justify-center px-8 py-4 text-lg font-medium">
                          Start Writing Your Book
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-6 text-sm text-base-paragraph">
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
                    <div className="absolute -top-6 -left-6 bg-white rounded-lg shadow-lg p-4 border">
                      <div className="flex items-center">
                        <TrendingUp className="w-8 h-8 text-brand-accent mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-base-heading">1M+</div>
                          <div className="text-sm text-base-paragraph">Books Created</div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 border">
                      <div className="flex items-center">
                        <Clock className="w-8 h-8 text-state-success mr-3" />
                        <div>
                          <div className="text-2xl font-bold text-base-heading">72hrs</div>
                          <div className="text-sm text-base-paragraph">Avg. Completion</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem/Solution Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-base-heading sm:text-4xl">
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
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-state-error/20">
                        <span className="text-state-error font-bold">✗</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-base-paragraph line-through opacity-70">
                        {item.problem}
                      </h3>
                      <div className="flex items-center mt-2">
                        <CheckCircle className="w-5 h-5 text-state-success mr-2" />
                        <p className="text-base text-state-success font-medium">{item.solution}</p>
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
      <div className="py-24 bg-base-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-brand-accent font-semibold tracking-wide uppercase">Everything You Need</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-base-heading sm:text-4xl">
              From idea to published book in record time
            </p>
            <p className="mt-4 max-w-2xl text-xl text-base-paragraph lg:mx-auto">
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
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-accent text-white mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-base-heading mb-4">{feature.title}</h3>
                  <p className="text-base-paragraph mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-base-paragraph">
                        <CheckCircle className="w-4 h-4 text-state-success mr-2" />
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

      {/* Newsletter Subscription Section */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Get writing tips delivered to your inbox
              </h2>
              <p className="mt-4 text-xl text-white/90">
                Join 25,000+ writers who receive our weekly newsletter with exclusive writing tips, 
                AI prompts, and early access to new features.
              </p>
              <div className="mt-6 flex flex-col justify-center items-center gap-6 text-white/80 md:flex-row lg:justify-start">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Weekly writing tips</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>AI prompt library</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Early access</span>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <SubscribeForm 
                // variant="minimal"
                placeholder="Enter your email for writing tips"
                buttonText="Get Writing Tips"
                className="max-w-md mx-auto lg:mx-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-base-heading sm:text-4xl">
              Join thousands of successful authors
            </h2>
            <p className="mt-4 text-xl text-base-paragraph">
              See what writers are saying about their ProsePilot experience
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                quote: "I went from idea to published novel in just 3 weeks. ProsePilot didn't just help me write—it helped me become a real author.",
                author: "Sarah Chen",
                role: "Romance Novelist",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
              },
              {
                quote: "The AI understood my vision better than I did. It helped me develop plot threads I never would have thought of on my own.",
                author: "Marcus Rodriguez",
                role: "Sci-Fi Author",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
              },
              {
                quote: "Finally, a tool that gets writers. The collaborative features helped my writing group finish our anthology in record time.",
                author: "Emily Watson",
                role: "Writing Group Leader",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-base-background rounded-lg p-8 relative">
                <Quote className="absolute top-4 left-4 w-8 h-8 text-brand-accent/50" />
                <div className="relative">
                  <p className="text-base-paragraph text-lg italic mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="font-semibold text-base-heading">{testimonial.author}</div>
                      <div className="text-sm text-base-paragraph">{testimonial.role}</div>
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
                <div className="text-4xl font-bold text-brand-accent">{stat.number}</div>
                <div className="text-brand-primary mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="bg-brand-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Start writing today, publish tomorrow
          </h2>
          <p className="mt-4 text-xl text-white/90">
            Choose the plan that fits your writing goals
          </p>
          
          <div className="mt-8">
            <Link to="/pricing">  
              <Button variant="secondaryOutline" className="px-8 py-4 text-lg font-semibold border-2">
                View All Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Final CTA Section */}
      <div className="bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5"></div>
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23B08F6A" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40`}></div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-brand-primary/10 rounded-full px-6 py-2 mb-6">
              <Rocket className="w-5 h-5 text-brand-primary mr-2" />
              <span className="text-brand-primary font-medium">Ready to Transform Your Writing?</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-base-heading mb-6">
              Your book is waiting.
              <span className="block text-brand-accent">Start writing it today.</span>
            </h2>
            
            <p className="text-xl text-base-paragraph max-w-3xl mx-auto mb-8">
              Don't let another year pass with your story untold. Join 50,000+ writers who've 
              transformed their ideas into published books with ProsePilot.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "Generate complete books in hours, not months"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Professional Quality",
                description: "AI-powered editing ensures publication-ready content"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Your Vision",
                description: "Maintain creative control while AI handles the heavy lifting"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-4">
                  <div className="text-brand-primary">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-base-heading mb-2">{feature.title}</h3>
                <p className="text-base-paragraph">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/workspace/signup">
              <Button className="px-8 py-4 text-lg font-semibold border-2 transition-all">
                Start Your Writing Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="px-8 py-4 text-lg font-semibold border-2 transition-all">
                View Pricing Plans
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-base-paragraph">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-state-success" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-state-success" />
              <span>Start from $9/month</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-state-success" />
              <span>50,000+ happy writers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}