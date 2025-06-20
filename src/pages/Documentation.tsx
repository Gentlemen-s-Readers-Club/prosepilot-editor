import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Code,
  Copy,
  Check,
  ChevronRight,
  FileText,
  Lightbulb,
  Sparkles,
  Zap,
  MessageSquare,
  Settings,
  BookText,
  Palette,
  VolumeX,
  Grid2X2,
  Crown,
  Star,
  Users,
  Info,
} from "lucide-react";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import {
  hasProOrStudioPlan,
  hasStudioPlan,
} from "../store/slices/subscriptionSlice";
import { useSubscriptions } from "../hooks/useSubscriptions";
import useAnalytics from "../hooks/useAnalytics";

export function Documentation() {
  const [copiedExample, setCopiedExample] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("about");

  const { trackPageView } = useAnalytics({
    measurementId: import.meta.env.VITE_ANALYTICS_ID,
  });

  useEffect(() => {
    trackPageView(window.location.pathname, "Documentation");
  }, [trackPageView]);

  // Check if user has Pro or Studio plan
  const { hasActiveSubscription } = useSubscriptions();
  const hasProOrStudio = useSelector(hasProOrStudioPlan);
  const hasStudio = useSelector(hasStudioPlan);

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "about",
        "getting-started",
        "prompt-examples",
        "ai-settings",
        "pro-features",
        "editing-tools",
        "team-collaboration",
        "faq",
      ];

      // Find the section that is currently in view
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section is in view (with some buffer for better UX)
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedExample(id);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const promptExamples = [
    {
      id: "basic-plot",
      title: "Basic Plot",
      prompt:
        "Write a story about a person who finds a mysterious object and discovers it has special powers.",
      explanation:
        "This is a very basic plot outline that provides minimal details. It works but will likely produce generic results.",
    },
    {
      id: "detailed-plot",
      title: "Detailed Plot",
      prompt:
        "Write a story about a struggling artist who discovers an antique paintbrush in their grandmother's attic. When they use it to paint, their artwork comes to life. However, they soon realize that each painting they create takes a piece of their own life force, forcing them to choose between their artistic dreams and their own survival.",
      explanation:
        "This prompt expands the basic plot with specific character details, clear conflict, and consequences that drive the story forward.",
    },
    {
      id: "descriptive-ambience",
      title: "Descriptive Ambience & Setting",
      prompt:
        "Write a story set in a fog-shrouded coastal town where the salty air carries whispers of old secrets. The protagonist, a lighthouse keeper's daughter, discovers that the fog isn't just weather—it's a living entity that reveals hidden truths to those brave enough to listen. The atmosphere should feel both magical and slightly menacing, with the constant sound of waves crashing against rocky cliffs and seagulls crying overhead.",
      explanation:
        "This prompt focuses heavily on creating a specific atmosphere and mood through detailed sensory descriptions and environmental elements.",
    },
    {
      id: "character-specification",
      title: "Character Specification",
      prompt:
        "Write a story about Dr. Elena Vasquez, a 34-year-old neuroscientist who is brilliant but socially awkward due to her intense focus on her research. She has a photographic memory, speaks five languages, and has a habit of solving complex equations in her head when stressed. When her latest experiment goes wrong, she must rely on her analytical mind and the help of her only friend—a janitor named Marcus who has an uncanny ability to read people's emotions.",
      explanation:
        "This prompt provides detailed character backgrounds, personality traits, specific skills, and relationship dynamics that will shape the story.",
    },
    {
      id: "title-specific",
      title: "Title-Specific Story",
      prompt:
        'Write a novel titled "The Last Bookstore on Earth" about a woman named Sarah who inherits a mysterious bookstore that only appears to people who truly need it. Each book in the store contains a story that somehow helps the reader solve their most pressing problem. However, Sarah discovers that every time someone finds their solution, a book disappears from the store, and she must decide whether to keep helping people or preserve the magical collection.',
      explanation:
        "This prompt specifies the exact title and builds the entire concept around it, creating a cohesive premise that ties the title to the plot.",
    },
    {
      id: "narrative-technique",
      title: "Narrative Technique Specification",
      prompt:
        "Write a story about a detective investigating a series of disappearances in a small town, but tell it through three different perspectives: the detective's official case notes, the diary entries of a local teenager who suspects they know what's happening, and anonymous letters sent to the town newspaper. Each perspective should reveal different pieces of the mystery, and the reader should be able to piece together the truth by reading between the lines of all three narratives.",
      explanation:
        "This prompt focuses on narrative structure and technique, specifying how the story should be told rather than just what happens.",
    },
    {
      id: "thematic-exploration",
      title: "Thematic Exploration",
      prompt:
        'Write a story that explores the theme of "the price of knowledge" through a protagonist who discovers they can see the future, but each vision they have ages them by one year. The story should examine questions about whether some knowledge is worth the cost, the responsibility that comes with foresight, and whether ignorance can truly be bliss. Include moments where the protagonist must choose between using their gift to help others or preserving their own life.',
      explanation:
        "This prompt centers around exploring specific themes and philosophical questions, using the plot as a vehicle for deeper meaning.",
    },
  ];

  const narratorOptions = [
    "First-person",
    "Second-person",
    "Third-person limited",
    "Third-person omniscient",
    "Third-person objective",
    "Stream of consciousness",
    "Unreliable narrator",
    "Alternating narrators",
  ];

  const literatureStyles = [
    "Realism",
    "Modernism",
    "Postmodernism",
    "Romanticism",
    "Gothic",
    "Magical Realism",
    "Surrealism",
    "Minimalism",
    "Existentialism",
    "Naturalism",
    "Expressionism",
    "Symbolism",
    "Absurdism",
    "Classicism",
    "Futurism",
    "Impressionism",
    "Transcendentalism",
    "Baroque",
    "Regionalism",
    "Dadaism",
  ];

  const toneOptions = [
    "Serious",
    "Humorous",
    "Formal",
    "Informal",
    "Optimistic",
    "Pessimistic",
    "Nostalgic",
    "Reflective",
    "Suspenseful",
    "Dramatic",
    "Playful",
    "Somber",
    "Joyful",
    "Melancholic",
    "Ironic",
    "Sarcastic",
    "Affectionate",
    "Bitter",
    "Angry",
    "Hopeful",
  ];

  return (
    <div className="min-h-screen bg-base-background">
      <Helmet>
        <title>ProsePilot - Documentation</title>
      </Helmet>
      {/* Header */}
      <div className="bg-white pt-16 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <Link
              to="/"
              className="flex items-center text-base-heading hover:text-base-heading/80 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-base-heading mb-4">
                Documentation
              </h1>
              <p className="text-xl text-base-paragraph leading-relaxed">
                Learn how to use ProsePilot effectively with our comprehensive
                guides and examples.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 shrink-0">
            <div className="sticky top-24">
              <nav className="space-y-1">
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    activeSection === "about"
                      ? "bg-brand-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => scrollToSection("about")}
                >
                  About
                </button>
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    activeSection === "getting-started"
                      ? "bg-brand-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => scrollToSection("getting-started")}
                >
                  Getting Started
                </button>
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    activeSection === "prompt-examples"
                      ? "bg-brand-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => scrollToSection("prompt-examples")}
                >
                  Prompt Examples
                </button>
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    activeSection === "ai-settings"
                      ? "bg-brand-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => scrollToSection("ai-settings")}
                >
                  AI Settings Guide
                </button>
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    activeSection === "pro-features"
                      ? "bg-brand-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => scrollToSection("pro-features")}
                >
                  Pro & Studio Features
                </button>
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    activeSection === "editing-tools"
                      ? "bg-brand-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => scrollToSection("editing-tools")}
                >
                  Editing Tools
                </button>
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    activeSection === "team-collaboration"
                      ? "bg-brand-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => scrollToSection("team-collaboration")}
                >
                  Team Collaboration
                </button>
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    activeSection === "faq"
                      ? "bg-brand-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => scrollToSection("faq")}
                >
                  FAQ
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* About */}
            <section id="about" className="mb-16">
              <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
                <Info className="w-8 h-8 text-brand-accent mr-4" />
                About ProsePilot
              </h2>
              <div>
                <div className="mx-auto">
                  <p className="text-base-paragraph mb-6">
                    ProsePilot is an AI-powered writing platform that transforms
                    your ideas into complete, publication-ready books in record
                    time. Founded by acclaimed authors Paulo Guerra and David
                    Bergmann, ProsePilot combines cutting-edge artificial
                    intelligence with decades of storytelling expertise to help
                    writers of all levels bring their stories to life.
                  </p>

                  <p className="text-base-paragraph mb-6">
                    Our platform enables you to generate entire books from
                    simple prompts, with advanced features for customizing
                    narrative voice, literary style, and tone. Whether you're a
                    first-time author looking to publish your debut novel or a
                    seasoned writer seeking to streamline your creative process,
                    ProsePilot provides the tools you need to write faster
                    without sacrificing quality.
                  </p>

                  <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-lg p-6 mb-8">
                    <div className="flex items-start">
                      <Sparkles className="w-6 h-6 text-brand-accent mt-1 mr-3 shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-base-heading mb-2">
                          Our Mission
                        </h3>
                        <p className="text-base-paragraph text-sm">
                          At ProsePilot, we believe everyone has stories worth
                          telling. Our mission is to democratize book creation
                          by removing technical barriers and accelerating the
                          writing process, allowing more diverse voices to share
                          their stories with the world.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center mb-4">
                        <BookOpen className="w-5 h-5 text-brand-accent mr-2" />
                        <h3 className="font-semibold text-base-heading">
                          Complete Book Generation
                        </h3>
                      </div>
                      <p className="text-sm text-base-paragraph">
                        Generate full-length books from simple prompts with AI
                        that understands narrative structure, character
                        development, and genre conventions.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center mb-4">
                        <Users className="w-5 h-5 text-brand-accent mr-2" />
                        <h3 className="font-semibold text-base-heading">
                          Team Collaboration (Coming soon)
                        </h3>
                      </div>
                      <p className="text-sm text-base-paragraph">
                        Work together with editors, co-authors, and beta readers
                        using our collaborative tools designed specifically for
                        book projects.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Getting Started */}
            <section id="getting-started" className="mb-16">
              <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
                <BookOpen className="w-8 h-8 text-brand-accent mr-4" />
                Getting Started
              </h2>

              <div>
                <p className="text-base-paragraph">
                  Welcome to ProsePilot! This guide will help you get started
                  with our AI-powered writing platform. Follow these simple
                  steps to create your first book:
                </p>

                <div className="bg-white rounded-lg shadow-md p-6 my-6">
                  <h3 className="text-xl font-semibold text-base-heading mb-4">
                    Quick Start Guide
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="bg-brand-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                        1
                      </div>
                      <span className="text-base-paragraph">
                        Create an account if you haven't already
                      </span>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-brand-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                        2
                      </div>
                      <span className="text-base-paragraph">
                        From your dashboard, click "Create New Book"
                      </span>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-brand-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                        3
                      </div>
                      <span className="text-base-paragraph">
                        Enter your story idea or outline
                      </span>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-brand-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                        4
                      </div>
                      <span className="text-base-paragraph">
                        Choose categories, language, and optional advanced
                        settings
                      </span>
                    </div>

                    <div className="flex items-center">
                      <div className="bg-brand-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                        5
                      </div>
                      <span className="text-base-paragraph">
                        Click "Create Book" and wait while our AI generates your
                        content
                      </span>
                    </div>
                  </div>
                </div>

                <p>
                  For more detailed instructions, check out our{" "}
                  <Link
                    to="/help/create-first-book"
                    className="text-brand-primary hover:underline"
                  >
                    comprehensive guide
                  </Link>{" "}
                  to creating your first book.
                </p>
              </div>
            </section>

            {/* Prompt Examples */}
            <section id="prompt-examples" className="mb-16">
              <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
                <Lightbulb className="w-8 h-8 text-brand-accent mr-4" />
                Prompt Examples
              </h2>

              <div>
                <p className="text-base-paragraph">
                  The quality of your prompt greatly influences the quality of
                  your generated book. Here are some examples of effective
                  prompts for different genres:
                </p>

                <div className="space-y-6 mt-6">
                  {promptExamples.map((example) => (
                    <div
                      key={example.id}
                      className="bg-white rounded-lg shadow-md p-6"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-base-heading">
                          {example.title}
                        </h3>
                        <button
                          onClick={() =>
                            copyToClipboard(example.prompt, example.id)
                          }
                          className="flex items-center text-sm text-brand-primary hover:text-brand-primary/80"
                        >
                          {copiedExample === example.id ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <p className="text-gray-700 italic">{example.prompt}</p>
                      </div>
                      <div className="text-sm text-base-paragraph">
                        <strong>Why this works:</strong> {example.explanation}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-state-info-light border border-state-info rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-state-info mb-3 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Pro Tips for Effective Prompts
                  </h3>
                  <ul className="text-state-info space-y-2">
                    <li>
                      • <strong>Be specific</strong> about your main character,
                      setting, and central conflict
                    </li>
                    <li>
                      • <strong>Mention your target audience</strong> (e.g.,
                      middle grade, young adult, adult)
                    </li>
                    <li>
                      • <strong>Reference similar authors or books</strong> if
                      you want a particular style
                    </li>
                    <li>
                      • <strong>Specify the title</strong> if you have a
                      particular one in mind
                    </li>
                    <li>
                      • <strong>Describe key themes</strong> you want to explore
                      in your story
                    </li>
                    <li>
                      • <strong>Include character motivations</strong> and what
                      drives their actions
                    </li>
                    <li>
                      • <strong>Mention the time period</strong> and historical
                      context if relevant
                    </li>
                    <li>
                      • <strong>Specify the location</strong> - real or
                      imaginary city, country, or specific setting details
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* AI Settings Guide */}
            <section id="ai-settings" className="mb-16">
              <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
                <Settings className="w-8 h-8 text-brand-accent mr-4" />
                AI Settings Guide
              </h2>

              <div>
                <p className="mb-6 text-base-paragraph">
                  ProsePilot offers advanced AI settings to fine-tune your book
                  generation. Understanding these options will help you achieve
                  the exact style and tone you're looking for:
                </p>

                <div className="grid grid-cols-1 gap-8">
                  {/* Narrator Perspective */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start mb-4">
                      <div className="bg-brand-secondary/60 p-3 rounded-lg mr-4">
                        <BookText className="w-6 h-6 text-brand-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-base-heading">
                          Narrator Perspective
                        </h3>
                        <p className="text-base-paragraph text-sm">
                          Choose the viewpoint from which your story is told
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        {narratorOptions
                          .slice(0, Math.ceil(narratorOptions.length / 2))
                          .map((option, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 p-4 rounded-lg"
                            >
                              <h4 className="font-medium text-gray-900 mb-1">
                                {option}
                              </h4>
                              <p className="text-sm text-base-paragraph">
                                {option === "First-person" &&
                                  'Narrated from the "I" perspective. Creates intimacy and immediacy.'}
                                {option === "Second-person" &&
                                  'Addresses the reader as "you." Creates an immersive, interactive feel.'}
                                {option === "Third-person limited" &&
                                  "Follows one character closely. Most versatile option."}
                                {option === "Third-person omniscient" &&
                                  "All-knowing narrator who can access any character's thoughts."}
                              </p>
                            </div>
                          ))}
                      </div>
                      <div className="space-y-4">
                        {narratorOptions
                          .slice(Math.ceil(narratorOptions.length / 2))
                          .map((option, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 p-4 rounded-lg"
                            >
                              <h4 className="font-medium text-gray-900 mb-1">
                                {option}
                              </h4>
                              <p className="text-sm text-base-paragraph">
                                {option === "Third-person objective" &&
                                  "Reports only what can be seen and heard, without access to characters' thoughts."}
                                {option === "Stream of consciousness" &&
                                  "Presents character thoughts as they occur, often in a flowing, non-linear style."}
                                {option === "Unreliable narrator" &&
                                  "A narrator whose credibility is compromised, creating ambiguity and tension."}
                                {option === "Alternating narrators" &&
                                  "Switches between different character perspectives throughout the story."}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Literature Style */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start mb-4">
                      <div className="bg-brand-secondary/60 p-3 rounded-lg mr-4">
                        <Palette className="w-6 h-6 text-brand-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-base-heading">
                          Literature Style
                        </h3>
                        <p className="text-base-paragraph text-sm">
                          Define the artistic approach and aesthetic of your
                          writing
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {literatureStyles.map((style, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {style}
                          </h4>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="bg-state-info-light p-4 rounded-lg">
                        <h4 className="font-medium text-state-info mb-2">
                          Popular Styles Explained:
                        </h4>
                        <div className="space-y-2 text-sm text-state-info">
                          <p>
                            <strong>Realism:</strong> Depicts everyday life and
                            social issues with accuracy and detail.
                          </p>
                          <p>
                            <strong>Magical Realism:</strong> Blends realistic
                            elements with magical or fantastical components.
                          </p>
                          <p>
                            <strong>Gothic:</strong> Features dark, mysterious
                            settings, supernatural elements, and emotional
                            intensity.
                          </p>
                          <p>
                            <strong>Modernism:</strong> Experiments with form
                            and style, often featuring stream of consciousness
                            and fragmentation.
                          </p>
                          <p>
                            <strong>Postmodernism:</strong> Self-referential,
                            ironic, and playful, often challenging traditional
                            narrative structures.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Writing Tone */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start mb-4">
                      <div className="bg-brand-secondary/60 p-3 rounded-lg mr-4">
                        <VolumeX className="w-6 h-6 text-brand-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-base-heading">
                          Writing Tone
                        </h3>
                        <p className="text-base-paragraph text-sm">
                          Set the emotional quality and attitude of your
                          narrative
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {toneOptions.map((tone, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {tone}
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-state-info-light border border-state-info rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-state-info mb-3">
                    💡 Setting selection tips:
                  </h3>
                  <ul className="text-state-info space-y-2 text-sm">
                    <li>
                      • <strong>Match your genre:</strong> Thriller works well
                      with third person limited and dramatic tone
                    </li>
                    <li>
                      • <strong>Consider your audience:</strong> YA books often
                      benefit from first person and conversational tone
                    </li>
                    <li>
                      • <strong>Experiment:</strong> Try generating the same
                      story with different settings to see what works best
                    </li>
                    <li>
                      • <strong>Stay consistent:</strong> Don't mix conflicting
                      styles (e.g., literary fiction with very casual tone)
                    </li>
                  </ul>
                </div>

                <div className="bg-state-warning-light border border-state-warning rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-state-warning mb-3">
                    Recommended Combinations
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-state-warning">
                        For Thrillers:
                      </h4>
                      <p className="text-state-warning text-sm">
                        Third Person Limited + Suspenseful Tone + Realism or
                        Gothic Style
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-state-warning">
                        For Romance:
                      </h4>
                      <p className="text-state-warning text-sm">
                        First Person or Alternating Narrators + Affectionate or
                        Nostalgic Tone + Romanticism Style
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-state-warning">
                        For Literary Fiction:
                      </h4>
                      <p className="text-state-warning text-sm">
                        Stream of Consciousness + Reflective Tone + Modernism or
                        Postmodernism Style
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-state-warning">
                        For Science Fiction:
                      </h4>
                      <p className="text-state-warning text-sm">
                        Third Person Omniscient + Serious or Dramatic Tone +
                        Futurism Style
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-state-warning">
                        For Magical Realism:
                      </h4>
                      <p className="text-state-warning text-sm">
                        Third Person Limited + Nostalgic Tone + Magical Realism
                        or Surrealism Style
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-state-success-light border border-state-success rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-state-success mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Advanced Setting Combinations
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-state-success">
                        Experimental Fiction:
                      </h4>
                      <p className="text-state-success text-sm">
                        <strong>Prompt:</strong> "Write a story about a person
                        who discovers they can hear the thoughts of inanimate
                        objects. Use a second-person perspective with a stream
                        of consciousness style and an ironic tone that gradually
                        shifts to melancholic as the protagonist realizes the
                        loneliness of being the only one with this ability."
                      </p>
                      <p className="text-state-success text-sm mt-1">
                        <strong>Settings:</strong> Second-person + Stream of
                        consciousness + Ironic/Melancholic tone
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-state-success">
                        Psychological Horror:
                      </h4>
                      <p className="text-state-success text-sm">
                        <strong>Prompt:</strong> "Create a psychological horror
                        story about a lighthouse keeper who begins to question
                        their sanity during a violent winter storm. Use an
                        unreliable narrator with Gothic style and a suspenseful
                        tone that creates ambiguity about whether supernatural
                        events are occurring or if it's all in the protagonist's
                        mind."
                      </p>
                      <p className="text-state-success text-sm mt-1">
                        <strong>Settings:</strong> Unreliable narrator + Gothic
                        style + Suspenseful tone
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Pro & Studio Features */}
            <section id="pro-features" className="mb-16">
              <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
                <Crown className="w-8 h-8 text-brand-accent mr-4" />
                Pro & Studio Features
              </h2>

              <div>
                <p className="text-base-paragraph mb-6">
                  Unlock advanced features and collaboration tools with our Pro
                  and Studio plans. These premium features are designed to
                  enhance your writing workflow and enable seamless team
                  collaboration.
                </p>

                <div className="space-y-6">
                  {/* Annotations System */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start mb-4">
                      <div className="bg-brand-primary/10 p-3 rounded-lg mr-4">
                        <MessageSquare className="w-6 h-6 text-brand-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-base-heading">
                            Annotations System
                          </h3>
                          <span className="bg-brand-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                            Pro & Studio
                          </span>
                        </div>
                        <p className="text-base-paragraph text-sm mb-4">
                          Advanced commenting and feedback system for
                          collaborative editing and revision tracking.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-base-heading mb-2">
                          How to Use:
                        </h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Select text to add an annotation</li>
                          <li>• Add comments, questions, or revision notes</li>
                          <li>
                            • Reply to annotations for collaborative editing
                          </li>
                          <li>• Mark annotations as resolved when addressed</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-base-heading mb-2">
                          Best Practices:
                        </h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Be specific in your annotation comments</li>
                          <li>• Use annotations for tracking issues to fix</li>
                          <li>
                            • Categorize annotations by type (plot, character,
                            etc.)
                          </li>
                          <li>
                            • Review and resolve annotations systematically
                          </li>
                        </ul>
                      </div>
                    </div>
                    {hasActiveSubscription && !hasProOrStudio && (
                      <div className="mt-4 p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-lg">
                        <Link
                          to="/workspace/subscription"
                          className="flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 transition-colors"
                        >
                          <Star className="w-4 h-4" />
                          <span className="font-medium text-sm">
                            Upgrade to Pro or Studio to unlock the annotations
                            system
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Advanced Export Options */}
                  <div className="bg-white rounded-lg shadow-md p-6 border-2 border-brand-primary/20">
                    <div className="flex items-start mb-4">
                      <div className="bg-brand-primary/10 p-3 rounded-lg mr-4">
                        <FileText className="w-6 h-6 text-brand-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-base-heading">
                            Advanced Export Options
                          </h3>
                          <span className="bg-brand-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                            Pro & Studio
                          </span>
                        </div>
                        <p className="text-base-paragraph text-sm mb-4">
                          Export your books in multiple professional formats for
                          publishing and distribution.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-base-heading mb-2">
                          Export Formats:
                        </h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>
                            • <strong>EPUB</strong> - Standard e-book format
                            (all plans)
                          </li>
                          <li>
                            • <strong>PDF</strong> - Professional print-ready
                            format
                          </li>
                          <li>
                            • <strong>DOCX</strong> - Microsoft Word compatible
                            format
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-base-heading mb-2">
                          Benefits:
                        </h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Publish directly to major platforms</li>
                          <li>• Professional formatting for print</li>
                          <li>• Easy sharing with editors and collaborators</li>
                          <li>• Archive your work in multiple formats</li>
                        </ul>
                      </div>
                    </div>

                    {hasActiveSubscription && !hasProOrStudio && (
                      <div className="mt-4 p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-lg">
                        <Link
                          to="/workspace/subscription"
                          className="flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 transition-colors"
                        >
                          <Star className="w-4 h-4" />
                          <span className="font-medium text-sm">
                            Upgrade to Pro or Studio for PDF and DOCX export
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Team Collaboration */}
                  <div className="bg-white rounded-lg shadow-md p-6 border-2 border-brand-primary/20">
                    <div className="flex items-start mb-4">
                      <div className="bg-brand-primary/10 p-3 rounded-lg mr-4">
                        <Users className="w-6 h-6 text-brand-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-base-heading">
                            Team Collaboration (Coming soon)
                          </h3>
                          <span className="bg-brand-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                            Studio
                          </span>
                        </div>
                        <p className="text-base-paragraph text-sm mb-4">
                          Advanced team management and collaboration features
                          for professional writing teams.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-base-heading mb-2">
                          Team Features:
                        </h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Create and manage multiple teams</li>
                          <li>• Invite team members with specific roles</li>
                          <li>• Shared workspace for team projects</li>
                          <li>• Activity tracking and team analytics</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-base-heading mb-2">
                          Collaboration Tools:
                        </h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Real-time collaborative editing</li>
                          <li>• Team-wide annotation systems</li>
                          <li>• Shared version history</li>
                          <li>• Team communication tools</li>
                        </ul>
                      </div>
                    </div>

                    {hasActiveSubscription && !hasStudio && (
                      <div className="mt-4 p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-lg">
                        <Link
                          to="/workspace/subscription"
                          className="flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 transition-colors"
                        >
                          <Star className="w-4 h-4" />
                          <span className="font-medium text-sm">
                            Upgrade to Studio for advanced team collaboration
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Editing Tools */}
            <section id="editing-tools" className="mb-16">
              <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
                <FileText className="w-8 h-8 text-brand-accent mr-4" />
                Editing Tools
              </h2>

              <div>
                <p className="text-base-paragraph">
                  ProsePilot provides a comprehensive set of editing tools to
                  help you refine your generated content. Here's how to make the
                  most of these features:
                </p>

                <div className="space-y-8 mt-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-base-heading mb-4">
                      Rich Text Editor
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-base-heading mb-2">
                          Key Features:
                        </h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>
                            • Formatting options (bold, italic, headings, etc.)
                          </li>
                          <li>• Text alignment controls</li>
                          <li>• List formatting (bulleted and numbered)</li>
                          <li>• Blockquote formatting</li>
                          <li>• Keyboard shortcuts for common actions</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-base-heading mb-2">
                          Pro Tips:
                        </h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>
                            • Use headings (H1, H2, H3) to structure your
                            chapters
                          </li>
                          <li>• Maintain consistent formatting throughout</li>
                          <li>• Use keyboard shortcuts for faster editing</li>
                          <li>• Save versions regularly to track changes</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-base-heading mb-4">
                      Annotations System
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-base-heading mb-2">
                          How to Use:
                        </h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Select text to add an annotation</li>
                          <li>• Add comments, questions, or revision notes</li>
                          <li>
                            • Reply to annotations for collaborative editing
                          </li>
                          <li>• Mark annotations as resolved when addressed</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-base-heading mb-2">
                          Best Practices:
                        </h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Be specific in your annotation comments</li>
                          <li>• Use annotations for tracking issues to fix</li>
                          <li>
                            • Categorize annotations by type (plot, character,
                            etc.)
                          </li>
                          <li>
                            • Review and resolve annotations systematically
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-base-heading mb-4">
                      Version History
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-base-heading mb-2">
                          Features:
                        </h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Automatic version tracking</li>
                          <li>• Compare different versions</li>
                          <li>• Restore previous versions</li>
                          <li>• Version notes and timestamps</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-base-heading mb-2">
                          When to Use:
                        </h4>
                        <ul className="text-gray-700 space-y-1 text-sm">
                          <li>• Before making major revisions</li>
                          <li>• After completing a draft</li>
                          <li>
                            • When experimenting with different approaches
                          </li>
                          <li>• To track progress over time</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-state-success-light border border-state-success rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-state-success mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Keyboard Shortcuts
                  </h3>

                  {/* Windows/Linux Shortcuts */}
                  <div className="mb-6">
                    <h4 className="font-medium text-state-success mb-3 flex items-center">
                      <Grid2X2 className="w-4 h-4 mr-2" />
                      Windows & Linux
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          Ctrl+B
                        </span>
                        <span className="text-base-paragraph ml-3">
                          Bold text
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          Ctrl+I
                        </span>
                        <span className="text-base-paragraph ml-3">
                          Italic text
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          Ctrl+Z
                        </span>
                        <span className="text-base-paragraph ml-3">Undo</span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          Ctrl+Y
                        </span>
                        <span className="text-base-paragraph ml-3">Redo</span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          Ctrl+A
                        </span>
                        <span className="text-base-paragraph ml-3">
                          Select all
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          Ctrl+C
                        </span>
                        <span className="text-base-paragraph ml-3">Copy</span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          Ctrl+V
                        </span>
                        <span className="text-base-paragraph ml-3">Paste</span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          Ctrl+X
                        </span>
                        <span className="text-base-paragraph ml-3">Cut</span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          Ctrl+F
                        </span>
                        <span className="text-base-paragraph ml-3">Find</span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          Ctrl+S
                        </span>
                        <span className="text-base-paragraph ml-3">
                          Save version
                        </span>
                      </div>
                      {/* Annotation shortcuts - Only show for Pro or Studio plan users */}
                      {hasProOrStudio ? (
                        <>
                          <div className="bg-white p-3 rounded-md">
                            <span className="font-medium text-base-heading">
                              Ctrl+Shift+A
                            </span>
                            <span className="text-base-paragraph ml-3">
                              Create annotation
                            </span>
                          </div>
                          <div className="bg-white p-3 rounded-md">
                            <span className="font-medium text-base-heading">
                              Ctrl+Shift+P
                            </span>
                            <span className="text-base-paragraph ml-3">
                              Toggle annotation panel
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-gray-100 p-3 rounded-md opacity-60">
                            <span className="font-medium text-gray-500">
                              Ctrl+Shift+A
                            </span>
                            <span className="text-gray-500 ml-3">
                              Create annotation (Pro & Studio)
                            </span>
                          </div>
                          <div className="bg-gray-100 p-3 rounded-md opacity-60">
                            <span className="font-medium text-gray-500">
                              Ctrl+Shift+P
                            </span>
                            <span className="text-gray-500 ml-3">
                              Toggle annotation panel (Pro & Studio)
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Mac Shortcuts */}
                  <div>
                    <h4 className="font-medium text-state-success mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      Mac
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          ⌘+B
                        </span>
                        <span className="text-base-paragraph ml-3">
                          Bold text
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          ⌘+I
                        </span>
                        <span className="text-base-paragraph ml-3">
                          Italic text
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          ⌘+Z
                        </span>
                        <span className="text-base-paragraph ml-3">Undo</span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          ⌘+Shift+Z
                        </span>
                        <span className="text-base-paragraph ml-3">Redo</span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          ⌘+A
                        </span>
                        <span className="text-base-paragraph ml-3">
                          Select all
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          ⌘+C
                        </span>
                        <span className="text-base-paragraph ml-3">Copy</span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          ⌘+V
                        </span>
                        <span className="text-base-paragraph ml-3">Paste</span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          ⌘+X
                        </span>
                        <span className="text-base-paragraph ml-3">Cut</span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          ⌘+F
                        </span>
                        <span className="text-base-paragraph ml-3">Find</span>
                      </div>
                      <div className="bg-white p-3 rounded-md">
                        <span className="font-medium text-base-heading">
                          ⌘+S
                        </span>
                        <span className="text-base-paragraph ml-3">
                          Save version
                        </span>
                      </div>
                      {/* Annotation shortcuts - Only show for Pro or Studio plan users */}
                      {hasProOrStudio ? (
                        <>
                          <div className="bg-white p-3 rounded-md">
                            <span className="font-medium text-base-heading">
                              ⌘+Shift+A
                            </span>
                            <span className="text-base-paragraph ml-3">
                              Create annotation
                            </span>
                          </div>
                          <div className="bg-white p-3 rounded-md">
                            <span className="font-medium text-base-heading">
                              ⌘+Shift+P
                            </span>
                            <span className="text-base-paragraph ml-3">
                              Toggle annotation panel
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-gray-100 p-3 rounded-md opacity-60">
                            <span className="font-medium text-gray-500">
                              ⌘+Shift+A
                            </span>
                            <span className="text-gray-500 ml-3">
                              Create annotation (Pro & Studio)
                            </span>
                          </div>
                          <div className="bg-gray-100 p-3 rounded-md opacity-60">
                            <span className="font-medium text-gray-500">
                              ⌘+Shift+P
                            </span>
                            <span className="text-gray-500 ml-3">
                              Toggle annotation panel (Pro & Studio)
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {hasActiveSubscription && !hasProOrStudio && (
                    <div className="mt-6 p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-lg">
                      <Link
                        to="/workspace/subscription"
                        className="flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 transition-colors"
                      >
                        <Star className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          Upgrade to Pro or Studio to unlock annotation keyboard
                          shortcuts
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Team Collaboration */}
            <section id="team-collaboration" className="mb-16">
              <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
                <MessageSquare className="w-8 h-8 text-brand-accent mr-4" />
                Team Collaboration (Coming soon)
              </h2>

              <div>
                <p className="text-base-paragraph">
                  ProsePilot makes it easy to collaborate with other writers,
                  editors, and beta readers. Learn how to use our team features
                  effectively:
                </p>

                <div className="space-y-6 mt-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-base-heading mb-4">
                      Team Roles
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-yellow-100 p-2 rounded-full mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-yellow-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-base-heading">
                            Admin
                          </h4>
                          <p className="text-base-paragraph text-sm">
                            Full access to manage team, invite members, and edit
                            all books.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-base-heading">
                            Editor
                          </h4>
                          <p className="text-base-paragraph text-sm">
                            Can create and edit books, but cannot manage team
                            members.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-gray-100 p-2 rounded-full mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-base-paragraph"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-base-heading">
                            Reader
                          </h4>
                          <p className="text-base-paragraph text-sm">
                            View-only access to books with ability to add
                            annotations and comments.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-base-heading mb-4">
                      Collaboration Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-base-heading mb-2">
                          Team Management
                        </h4>
                        <ul className="text-base-paragraph space-y-1 text-sm">
                          <li>• Create teams for different projects</li>
                          <li>• Invite members via email</li>
                          <li>• Assign appropriate roles</li>
                          <li>• Monitor team activity</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-base-heading mb-2">
                          Collaborative Editing
                        </h4>
                        <ul className="text-base-paragraph space-y-1 text-sm">
                          <li>• Shared access to team books</li>
                          <li>• Version history tracking</li>
                          <li>• Annotations and comments</li>
                          <li>• Activity logs for transparency</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-state-info-light border border-state-info rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-state-info mb-3">
                      Best Practices for Team Collaboration
                    </h3>
                    <ul className="text-state-info space-y-2 text-sm">
                      <li>
                        • <strong>Establish clear guidelines</strong> for team
                        contributions and feedback
                      </li>
                      <li>
                        • <strong>Use annotations</strong> to provide specific,
                        actionable feedback
                      </li>
                      <li>
                        • <strong>Maintain regular communication</strong> about
                        project goals and progress
                      </li>
                      <li>
                        • <strong>Assign clear responsibilities</strong> to team
                        members based on their strengths
                      </li>
                      <li>
                        • <strong>Set realistic deadlines</strong> and track
                        progress through the platform
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="mt-8">
                  For more detailed information on team collaboration, check out
                  our{" "}
                  <Link
                    to="/help/team-collaboration"
                    className="text-brand-primary hover:underline"
                  >
                    Team Collaboration Guide
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mb-16">
              <h2 className="text-3xl font-bold text-base-heading mb-6 flex items-center">
                <Code className="w-8 h-8 text-brand-accent mr-4" />
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                {[
                  {
                    question: "How many books can I create?",
                    answer:
                      "The number of books you can create depends on your subscription plan. The Starter plan includes 5 credits (1 book), Pro Author includes 25 credits (5 books), and Studio includes 75 credits (15 books). Each book requires 5 credits to generate. You can also purchase additional credit packs anytime to create more books beyond your monthly allowance.",
                  },
                  {
                    question: "Can I edit my book after it's generated?",
                    answer:
                      "Yes! You have full editing capabilities for all generated books. You can modify content, add new chapters, reorganize sections, and make any other changes you'd like using our built-in editor.",
                  },
                  {
                    question:
                      "What happens if I'm not satisfied with the generated book?",
                    answer:
                      "If you're not satisfied with the results, you can try again with a more detailed prompt. While we don't offer credit refunds for generations you don't like, we provide extensive editing tools to help you refine the content.",
                  },
                  {
                    question: "Can I publish books created with ProsePilot?",
                    answer:
                      "Absolutely! You own all rights to the content generated for you. You can publish your books on any platform, including Amazon KDP, Barnes & Noble Press, and other self-publishing services.",
                  },
                  {
                    question: "How do I export my book?",
                    answer:
                      "From your book's detail page, click the 'Export' button when your book is marked as published. You can choose from multiple formats including PDF, EPUB, and DOCX, making it easy to publish or share your work.",
                  },
                  {
                    question: "Can I collaborate with others on my book?",
                    answer:
                      "Team collaboration features are coming soon! We're working on advanced team management tools that will allow you to invite collaborators with different permission levels. Team members will be able to view, comment on, or edit your books depending on the role you assign them. Stay tuned for updates!",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <h3 className="text-xl font-semibold text-base-heading mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-base-paragraph">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Help Articles */}
            <section className="border-t pt-8">
              <h3 className="text-2xl font-bold text-base-heading mb-6">
                Detailed Help Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  to="/help/create-first-book"
                  className="block bg-white shadow-md rounded-lg p-6 hover:bg-brand-secondary/30 transition-colors"
                >
                  <h4 className="font-semibold text-base-heading mb-2">
                    How to create your first book with AI
                  </h4>
                  <p className="text-base-paragraph text-sm mb-3">
                    Step-by-step guide to generating your first book using
                    ProsePilot.
                  </p>
                  <div className="flex items-center text-brand-accent text-sm">
                    <span>Read article</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>

                <Link
                  to="/help/credit-system"
                  className="block bg-white shadow-md rounded-lg p-6 hover:bg-brand-secondary/30 transition-colors"
                >
                  <h4 className="font-semibold text-base-heading mb-2">
                    Understanding the credit system
                  </h4>
                  <p className="text-base-paragraph text-sm mb-3">
                    Learn how credits work and how to manage your usage
                    effectively.
                  </p>
                  <div className="flex items-center text-brand-accent text-sm">
                    <span>Read article</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>

                <Link
                  to="/help/ai-best-practices"
                  className="block bg-white shadow-md rounded-lg p-6 hover:bg-brand-secondary/30 transition-colors"
                >
                  <h4 className="font-semibold text-base-heading mb-2">
                    Best practices for AI-generated content
                  </h4>
                  <p className="text-base-paragraph text-sm mb-3">
                    Tips and techniques for getting the best results from our
                    AI.
                  </p>
                  <div className="flex items-center text-brand-accent text-sm">
                    <span>Read article</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>

                {/* <Link
                  to="/help/team-collaboration"
                  className="block bg-white shadow-md rounded-lg p-6 hover:bg-brand-secondary/30 transition-colors"
                >
                  <h4 className="font-semibold text-base-heading mb-2">
                    Setting up team collaboration
                  </h4>
                  <p className="text-base-paragraph text-sm mb-3">
                    Learn how to work with others on your writing projects.
                  </p>
                  <div className="flex items-center text-brand-accent text-sm">
                    <span>Read article</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link> */}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
