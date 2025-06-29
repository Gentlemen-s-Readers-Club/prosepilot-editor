import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../../components/Navigation';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { 
  ArrowLeft,
  Brain,
  Clock,
  Users,
  Eye,
  ChevronRight,
  Lightbulb,
  Target,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  FileText,
  Settings,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import Footer from '../../components/Footer';
import { SEOHead } from '../../components/SEOHead';
import useAnalytics from '../../hooks/useAnalytics';

export function AIBestPractices() {
  const { trackPageView } = useAnalytics({
    measurementId: import.meta.env.VITE_ANALYTICS_ID,
  });

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [trackPageView]);
  
  return (
    <>
      <SEOHead
        title="AI Best Practices - ProsePilot Documentation"
        description="Master the art of working with AI to create compelling, high-quality books. Learn proven techniques for crafting effective prompts, optimizing settings, and refining generated content."
        keywords="AI writing best practices, prompt engineering, AI content optimization, writing tips, AI book generation, content quality"
        type="article"
      />
      
      <div className="min-h-screen bg-base-background">
        <Navigation />
        
        {/* Header */}
        <div className="bg-white pt-16 border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Link to="/docs" className="flex items-center text-base-heading hover:text-base-heading/80 mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Documentation
              </Link>
            </div>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-base-heading font-heading mb-4">
                  Best practices for AI-generated content
                </h1>
                <div className="flex items-center text-sm text-base-paragraph font-copy space-x-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-brand-accent" />
                    7 min read
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1 text-brand-accent" />
                    6.8k views
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-brand-accent" />
                    Writing Features
                  </div>
                </div>
                <p className="text-xl text-base-paragraph font-copy leading-relaxed">
                  Master the art of working with AI to create compelling, high-quality books. Learn proven techniques 
                  for crafting effective prompts, optimizing settings, and refining generated content.
                </p>
              </div>
              <div className="ml-8 hidden lg:block">
                <div className="bg-base-background rounded-lg p-6 w-64">
                  <h3 className="font-semibold text-base-heading font-heading mb-4">In this article</h3>
                  <nav className="space-y-2 text-sm">
                    <a href="#crafting-prompts" className="block text-base-paragraph font-copy hover:text-base-heading">Crafting effective prompts</a>
                    <a href="#ai-settings" className="block text-base-paragraph font-copy hover:text-base-heading">Optimizing AI settings</a>
                    <a href="#content-quality" className="block text-base-paragraph font-copy hover:text-base-heading">Ensuring content quality</a>
                    <a href="#editing-tips" className="block text-base-paragraph font-copy hover:text-base-heading">Post-generation editing</a>
                    <a href="#common-mistakes" className="block text-base-paragraph font-copy hover:text-base-heading">Common mistakes to avoid</a>
                    <a href="#advanced-techniques" className="block text-base-paragraph font-copy hover:text-base-heading">Advanced techniques</a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div>
            
            {/* Introduction */}
            <div className="bg-state-info-light border border-state-info rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <Brain className="w-6 h-6 text-state-info mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-state-info mb-2 font-heading">Why these practices matter</h3>
                  <p className="text-state-info text-sm font-copy">
                    AI is a powerful tool, but like any tool, the quality of your results depends on how you use it. 
                    These best practices will help you consistently generate high-quality content that requires minimal editing 
                    and truly reflects your creative vision.
                  </p>
                </div>
              </div>
            </div>

            {/* Crafting effective prompts */}
            <section id="crafting-prompts" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <Target className="w-8 h-8 text-brand-accent mr-4" />
                Crafting effective prompts
              </h2>
              
              <p className="text-base-paragraph font-copy mb-6">
                Your prompt is the foundation of your book. A well-crafted prompt gives the AI clear direction 
                and context, resulting in more coherent and engaging content.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-4">Essential prompt elements:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-state-success mr-2" />
                        Story fundamentals
                      </h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm">
                        <li>• <strong>Genre:</strong> Be specific (e.g., "psychological thriller" vs. "thriller")</li>
                        <li>• <strong>Setting:</strong> Time period, location, and world-building details</li>
                        <li>• <strong>Protagonist:</strong> Age, background, motivation, and key traits</li>
                        <li>• <strong>Central conflict:</strong> What drives the story forward</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-state-success mr-2" />
                        Style and tone
                      </h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm">
                        <li>• <strong>Narrative voice:</strong> First person, third person, etc.</li>
                        <li>• <strong>Tone:</strong> Dark, humorous, inspirational, etc.</li>
                        <li>• <strong>Pacing:</strong> Fast-paced action vs. character-driven</li>
                        <li>• <strong>Target audience:</strong> Age group and reading level</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-state-success-light border border-state-success rounded-lg p-6">
                  <h4 className="font-semibold text-state-success mb-3 font-heading">✅ Example of a strong prompt:</h4>
                  <div className="bg-white rounded-lg p-4 border">
                    <p className="text-state-success text-sm italic font-copy">
                      "A psychological thriller set in modern-day Seattle about Dr. Sarah Chen, a 35-year-old forensic psychologist 
                      who begins experiencing the same recurring nightmares as the serial killer she's profiling. As the line between 
                      her dreams and reality blurs, she must uncover the connection before she becomes the next victim. 
                      The story should be told in third person limited POV, with a dark, suspenseful tone and focus on psychological 
                      tension rather than graphic violence. Target audience: adult readers who enjoy authors like Gillian Flynn and Tana French."
                    </p>
                  </div>
                </div>

                <div className="bg-state-error-light border border-state-error rounded-lg p-6">
                  <h4 className="font-semibold text-state-error mb-3 font-heading">❌ Example of a weak prompt:</h4>
                  <div className="bg-white rounded-lg p-4 border">
                    <p className="text-state-error text-sm italic font-copy">
                      "A thriller about a psychologist who has nightmares."
                    </p>
                  </div>
                    <p className="text-state-error text-sm mt-3 font-copy"> 
                    <strong>Why this doesn't work:</strong> Too vague, lacks character details, setting, specific conflict, 
                    and gives no guidance on tone or style.
                  </p>
                </div>
              </div>
            </section>

            {/* AI Settings */}
            <section id="ai-settings" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <Settings className="w-8 h-8 text-brand-accent mr-4" />
                Optimizing AI settings
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                The advanced settings in ProsePilot allow you to fine-tune how the AI generates your content. 
                Understanding these options helps you achieve the exact style and tone you're looking for.
              </p>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-6 bg-white">
                    <h4 className="font-semibold text-base-heading font-heading mb-3 flex items-center">
                      <Eye className="w-5 h-5 text-state-info mr-2" />
                      Narrator Perspective
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong className="text-base-heading font-heading">First Person:</strong>
                        <p className="text-base-paragraph font-copy">Best for intimate, character-driven stories. Creates strong emotional connection.</p>
                      </div>
                      <div>
                        <strong className="text-base-heading font-heading">Third Person Limited:</strong>
                        <p className="text-base-paragraph font-copy">Most versatile. Follows one character closely while maintaining narrative flexibility.</p>
                      </div>
                      <div>
                        <strong className="text-base-heading font-heading">Third Person Omniscient:</strong>
                        <p className="text-base-paragraph font-copy">Great for complex plots with multiple characters and storylines.</p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 bg-white">
                    <h4 className="font-semibold text-base-heading font-heading mb-3 flex items-center">
                      <BookOpen className="w-5 h-5 text-state-success mr-2" />
                      Literature Style
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong className="text-base-heading font-heading">Literary Fiction:</strong>
                        <p className="text-base-paragraph font-copy">Character-focused, sophisticated prose, deeper themes.</p>
                      </div>
                      <div>
                        <strong className="text-base-heading font-heading">Commercial Fiction:</strong>
                        <p className="text-base-paragraph font-copy">Plot-driven, accessible language, broad appeal.</p>
                      </div>
                      <div>
                        <strong className="text-base-heading font-heading">Genre-Specific:</strong>
                        <p className="text-base-paragraph font-copy">Follows conventions of specific genres (mystery, romance, sci-fi, etc.).</p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 bg-white">
                    <h4 className="font-semibold text-base-heading font-heading mb-3 flex items-center">
                      <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
                      Writing Tone
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong className="text-base-heading font-heading">Serious:</strong>
                        <p className="text-base-paragraph font-copy">Formal, weighty topics, minimal humor.</p>
                      </div>
                      <div>
                        <strong className="text-base-heading font-heading">Casual:</strong>
                        <p className="text-base-paragraph font-copy">Casual, approachable, like talking to a friend.</p>
                      </div>
                      <div>
                        <strong className="text-base-heading font-heading">Dramatic:</strong>
                        <p className="text-base-paragraph font-copy">Heightened emotions, tension, vivid descriptions.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-state-info-light border border-state-info rounded-lg p-6">
                  <h4 className="font-semibold text-state-info font-heading mb-3">💡 Setting selection tips:</h4>
                  <ul className="text-state-info space-y-2 text-sm">
                    <li>• <strong>Match your genre:</strong> Thriller works well with third person limited and dramatic tone</li>
                    <li>• <strong>Consider your audience:</strong> YA books often benefit from first person and conversational tone</li>
                    <li>• <strong>Experiment:</strong> Try generating the same story with different settings to see what works best</li>
                    <li>• <strong>Stay consistent:</strong> Don't mix conflicting styles (e.g., literary fiction with very casual tone)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Content Quality */}
            <section id="content-quality" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <TrendingUp className="w-8 h-8 text-brand-accent mr-4" />
                Ensuring content quality
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                While ProsePilot's AI is sophisticated, there are steps you can take to maximize the quality 
                of your generated content from the start.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-4">Quality checklist for prompts:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Checkbox id="check-genre" className="mt-1" checked={false} onChange={() => {}} />
                      <label htmlFor="check-genre" className="ml-3 text-base-paragraph font-copy">
                        Specific genre and subgenre mentioned
                      </label>
                    </div>
                    <div className="flex items-start">
                      <Checkbox id="check-protagonist" className="mt-1" checked={false} onChange={() => {}} />
                      <label htmlFor="check-protagonist" className="ml-3 text-base-paragraph font-copy">
                        Clear protagonist with defined motivation
                      </label>
                    </div>
                    <div className="flex items-start">
                      <Checkbox id="check-setting" className="mt-1" checked={false} onChange={() => {}} />
                      <label htmlFor="check-setting" className="ml-3 text-base-paragraph font-copy">
                        Specific setting (time and place)
                      </label>
                    </div>
                    <div className="flex items-start">
                      <Checkbox id="check-conflict" className="mt-1" checked={false} onChange={() => {}} />
                      <label htmlFor="check-conflict" className="ml-3 text-base-paragraph font-copy">
                        Central conflict or problem clearly stated
                      </label>
                    </div>
                    <div className="flex items-start">
                      <Checkbox id="check-tone" className="mt-1" checked={false} onChange={() => {}} />
                      <label htmlFor="check-tone" className="ml-3 text-base-paragraph font-copy">
                        Desired tone and style indicated
                      </label>
                    </div>
                    <div className="flex items-start">
                      <Checkbox id="check-audience" className="mt-1" checked={false} onChange={() => {}} />
                      <label htmlFor="check-audience" className="ml-3 text-base-paragraph font-copy">
                        Target audience specified
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-state-success-light border border-state-success rounded-lg p-6">
                    <h4 className="font-semibold text-state-success mb-3 font-heading">✅ Do this:</h4>
                    <ul className="text-state-success space-y-2 text-sm">
                      <li>• Provide rich, specific details in your prompt</li>
                      <li>• Use the advanced settings to match your vision</li>
                      <li>• Include character motivations and backstory</li>
                      <li>• Specify the emotional journey you want</li>
                      <li>• Mention any important themes or messages</li>
                    </ul>
                  </div>

                  <div className="bg-state-error-light border border-state-error rounded-lg p-6">
                    <h4 className="font-semibold text-state-error mb-3 font-heading">❌ Avoid this:</h4>
                    <ul className="text-state-error space-y-2 text-sm">
                      <li>• Vague or overly broad prompts</li>
                      <li>• Conflicting genre or style instructions</li>
                      <li>• Too many complex subplots in one prompt</li>
                      <li>• Unrealistic expectations for word count</li>
                      <li>• Copying existing copyrighted works</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Editing Tips */}
            <section id="editing-tips" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <FileText className="w-8 h-8 text-brand-accent mr-4" />
                Post-generation editing
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                Even the best AI-generated content benefits from human editing. Here's how to efficiently 
                review and improve your generated book.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-4">Editing workflow:</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">First read-through</h5>
                        <p className="text-base-paragraph text-sm font-copy">Read the entire book without editing. Note major issues with plot, character consistency, or pacing.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Structural editing</h5>
                        <p className="text-base-paragraph text-sm font-copy">Address plot holes, character development, and overall story structure.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Line editing</h5>
                        <p className="text-base-paragraph text-sm font-copy">Improve sentence flow, word choice, and overall readability.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Copy editing</h5>
                        <p className="text-base-paragraph text-sm font-copy">Fix grammar, spelling, punctuation, and formatting issues.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-state-warning-light border border-state-warning rounded-lg p-6">
                  <h4 className="font-semibold text-state-warning font-heading mb-3">⚡ Quick editing tips:</h4>
                  <ul className="text-state-warning space-y-2 text-sm">
                    <li>• <strong>Focus on your voice:</strong> Add personal touches that make the story uniquely yours</li>
                    <li>• <strong>Strengthen dialogue:</strong> AI dialogue can be formal - make it more natural and character-specific</li>
                    <li>• <strong>Enhance descriptions:</strong> Add sensory details and specific imagery</li>
                    <li>• <strong>Tighten pacing:</strong> Cut unnecessary scenes and strengthen transitions</li>
                    <li>• <strong>Verify facts:</strong> Double-check any technical or historical details</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Common Mistakes */}
            <section id="common-mistakes" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <AlertTriangle className="w-8 h-8 text-brand-accent mr-4" />
                Common mistakes to avoid
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                Learn from the most common pitfalls that new users encounter when working with AI-generated content.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-state-error font-heading mb-4">Top mistakes and how to fix them:</h4>
                  <div className="space-y-6">
                    <div>
                      <h5 className="font-medium text-state-error font-heading mb-2">❌ Mistake: Using the generated content without any editing</h5>
                      <p className="text-state-error text-sm font-copy mb-2">
                        <strong>Why it's a problem:</strong> AI content lacks your unique voice and may have inconsistencies.
                      </p>
                      <p className="text-state-success text-sm font-copy">
                        <strong>✅ Solution:</strong> Always review and edit the content to add your personal style and fix any issues.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-state-error font-heading mb-2">❌ Mistake: Providing too little detail in prompts</h5>
                      <p className="text-state-error text-sm font-copy mb-2">
                        <strong>Why it's a problem:</strong> Vague prompts lead to generic, unfocused content.
                      </p>
                      <p className="text-state-success text-sm font-copy">
                        <strong>✅ Solution:</strong> Include specific details about characters, setting, conflict, and desired tone.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-state-error font-heading mb-2">❌ Mistake: Ignoring the advanced settings</h5>
                      <p className="text-state-error text-sm font-copy mb-2">
                        <strong>Why it's a problem:</strong> Default settings may not match your specific genre or style needs.
                      </p>
                      <p className="text-state-success text-sm font-copy">
                        <strong>✅ Solution:</strong> Experiment with narrator perspective, literature style, and tone settings.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-state-error font-heading mb-2">❌ Mistake: Expecting perfection on the first try</h5>
                      <p className="text-state-error text-sm font-copy mb-2">
                        <strong>Why it's a problem:</strong> Creates unrealistic expectations and disappointment.
                      </p>
                      <p className="text-state-success text-sm font-copy">
                        <strong>✅ Solution:</strong> View AI generation as a starting point that you'll refine and improve.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Advanced Techniques */}
            <section id="advanced-techniques" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <Lightbulb className="w-8 h-8 text-brand-accent mr-4" />
                Advanced techniques
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                Once you've mastered the basics, these advanced techniques can help you create even more 
                sophisticated and compelling content.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-4">Advanced prompt techniques:</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-2">Layered character development</h5>
                      <p className="text-base-paragraph text-sm font-copy mb-2">
                        Instead of just describing your protagonist, include their internal conflicts, fears, and growth arc.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-800 text-sm italic font-copy">
                          "Sarah appears confident as a forensic psychologist, but secretly struggles with imposter syndrome 
                          stemming from her working-class background. Her journey involves learning to trust her instincts 
                          and accept that she belongs in her field."
                        </p>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-2">Thematic integration</h5>
                      <p className="text-base-paragraph text-sm font-copy mb-2">
                        Explicitly mention the themes you want to explore and how they should be woven into the story.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-800 text-sm italic font-copy">
                          "The story explores themes of identity and belonging, with the underwater city serving as a metaphor 
                          for hidden depths within ourselves. Each discovery Sarah makes about the city should parallel 
                          a discovery about herself."
                        </p>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-2">Stylistic references</h5>
                      <p className="text-base-paragraph text-sm font-copy mb-2">
                        Reference specific authors or works whose style you admire (but don't copy).
                      </p>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-800 text-sm italic font-copy">
                          "The narrative style should evoke the atmospheric tension of Tana French's mysteries, 
                          with rich psychological depth and lyrical prose, but maintain a faster pace suitable for thriller readers."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-state-info-light border border-state-info rounded-lg p-6">
                  <h4 className="font-semibold text-state-info font-heading mb-3">🚀 Pro techniques:</h4>
                  <ul className="text-state-info space-y-2 text-sm">
                    <li>• <strong>Series consistency:</strong> When writing sequels, reference previous books in your prompt</li>
                    <li>• <strong>Genre blending:</strong> Specify how you want to combine elements from different genres</li>
                    <li>• <strong>Cultural authenticity:</strong> Include research notes about specific cultures or communities</li>
                    <li>• <strong>Experimental structures:</strong> Request non-linear narratives or unique formatting</li>
                    <li>• <strong>Multiple POVs:</strong> Specify how different character perspectives should be handled</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Related Articles */}
            <section className="border-t pt-8">
              <h3 className="text-2xl font-bold text-base-heading font-heading mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/help/create-first-book" className="block bg-white shadow-md rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-base-heading font-heading mb-2">How to create your first book with AI</h4>
                  <p className="text-base-paragraph text-sm font-copy mb-3">Step-by-step guide to generating your first book using ProsePilot.</p>
                  <div className="flex items-center text-brand-accent text-sm">
                    <span>Read article</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
                
                <Link to="/help/team-collaboration" className="block bg-white shadow-md rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-base-heading font-heading mb-2">Setting up team collaboration</h4>
                  <p className="text-base-paragraph text-sm font-copy mb-3">Learn how to work with others on your writing projects.</p>
                  <div className="flex items-center text-brand-accent text-sm">
                    <span>Read article</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-brand-primary py-12">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-white mb-4 font-heading">Ready to put these techniques to work?</h3>
            <p className="text-white/90 mb-6 font-copy">Start creating better AI-generated content with these proven strategies.</p>
            <Link to="/signup">
              <Button className="bg-white text-base-heading hover:bg-gray-100 px-8 py-3">
                Start Writing
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}