import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Navigation } from '../../components/Navigation';
import { 
  ArrowLeft,
  Clock,
  Users,
  UserPlus,
  Mail,
  Shield,
  Crown,
  Edit3,
  Eye,
  CheckCircle,
  Zap,
  FileText,
  MessageSquare,
  AlertCircle,
  Settings,
  ChevronRight
} from 'lucide-react';
import Footer from '../../components/Footer';
import { SEOHead } from '../../components/SEOHead';
import useAnalytics from '../../hooks/useAnalytics';

export function TeamCollaboration() {
  const { trackPageView } = useAnalytics({
    measurementId: import.meta.env.VITE_ANALYTICS_ID,
  });

  React.useEffect(() => {
    trackPageView(window.location.pathname);
  }, [trackPageView]);
  
  return (
    <>
      <SEOHead
        title="Team Collaboration - ProsePilot Guide"
        description="Learn how to collaborate with team members on writing projects using ProsePilot. Set up team workspaces, manage permissions, and streamline your writing workflow."
        keywords="team collaboration, writing teams, shared workspaces, project management, team permissions, collaborative writing"
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
                  Setting up team collaboration
                </h1>
                <div className="flex items-center text-sm text-base-paragraph font-copy space-x-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-brand-accent" />
                    6 min read
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1 text-brand-accent" />
                    3.2k views
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-brand-accent" />
                    Team Features
                  </div>
                </div>
                <p className="text-xl text-base-paragraph font-copy leading-relaxed">
                  Learn how to collaborate with team members on writing projects using ProsePilot. 
                  Set up shared workspaces, manage permissions, and streamline your collaborative writing workflow.
                </p>
              </div>
              <div className="ml-8 hidden lg:block">
                <div className="bg-base-background rounded-lg p-6 w-64">
                  <h3 className="font-semibold text-base-heading font-heading mb-4">In this article</h3>
                  <nav className="space-y-2 text-sm">
                    <a href="#creating-teams" className="block text-base-paragraph font-copy hover:text-base-heading">Creating your first team</a>
                    <a href="#inviting-members" className="block text-base-paragraph font-copy hover:text-base-heading">Inviting team members</a>
                    <a href="#roles-permissions" className="block text-base-paragraph font-copy hover:text-base-heading">Roles and permissions</a>
                    <a href="#collaborative-workflow" className="block text-base-paragraph font-copy hover:text-base-heading">Collaborative workflows</a>
                    <a href="#managing-teams" className="block text-base-paragraph font-copy hover:text-base-heading">Managing your team</a>
                    <a href="#best-practices" className="block text-base-paragraph font-copy hover:text-base-heading">Best practices</a>
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
                <Users className="w-6 h-6 text-state-info mt-1 mr-3 shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-state-info mb-2 font-heading">Why use teams?</h3>
                  <p className="text-state-info text-sm font-copy">
                    Teams in ProsePilot enable multiple writers to collaborate on books, share resources, and maintain 
                    consistent quality across projects. Whether you're a writing group, publishing house, or content agency, 
                    teams help streamline your collaborative writing process.
                  </p>
                </div>
              </div>
            </div>

            {/* Creating Teams */}
            <section id="creating-teams" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <UserPlus className="w-8 h-8 text-brand-accent mr-4" />
                Creating your first team
              </h2>
              
              <p className="text-base-paragraph font-copy mb-6">
                Setting up a team is the first step to collaborative writing. Teams allow you to organize projects, 
                manage access, and coordinate with other writers.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-4">Step-by-step team creation:</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Navigate to Teams</h5>
                        <p className="text-base-paragraph font-copy text-sm">From your dashboard, click "Teams" in the navigation menu, then "Create Team".</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Choose a team name</h5>
                        <p className="text-base-paragraph font-copy text-sm">Pick a descriptive name (3-50 characters). This will be visible to all team members.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Add description (optional)</h5>
                        <p className="text-base-paragraph font-copy text-sm">Describe your team's purpose, goals, or writing focus (up to 200 characters).</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Upload team logo (optional)</h5>
                        <p className="text-base-paragraph font-copy text-sm">Add a visual identity for your team with a custom logo or image.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-state-success-light border border-state-success rounded-lg p-6">
                  <h4 className="font-semibold text-state-success mb-3 font-heading">✅ Team naming best practices:</h4>
                  <ul className="text-state-success space-y-1 text-sm font-copy">
                    <li>• Use descriptive names that reflect your team's purpose</li>
                    <li>• Keep it professional if working with clients</li>
                    <li>• Avoid special characters or numbers unless necessary</li>
                    <li>• Consider including your genre or niche (e.g., "Mystery Writers Collective")</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Inviting Members */}
            <section id="inviting-members" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <Mail className="w-8 h-8 text-brand-accent mr-4" />
                Inviting team members
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                Once your team is created, you can invite up to 50 members (depending on your plan). 
                Invitations are sent via email and include a secure link to join your team.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-4">How to invite members:</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Access team settings</h5>
                        <p className="text-base-paragraph font-copy text-sm">From your team page, click "Invite Members" or use the team settings menu.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Enter email addresses</h5>
                        <p className="text-base-paragraph font-copy text-sm">Add up to 3 email addresses at once. Each person will receive their own invitation.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Select role</h5>
                        <p className="text-base-paragraph font-copy text-sm">Choose the appropriate role for the invitees (Admin, Editor, or Reader).</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-brand-accent/15 text-brand-accent rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</div>
                      <div>
                        <h5 className="font-medium text-base-heading font-heading">Add personal message (optional)</h5>
                        <p className="text-base-paragraph font-copy text-sm">Include a custom message explaining why you're inviting them and what to expect.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-state-warning-light border border-state-warning rounded-lg p-6">
                  <h4 className="font-semibold text-state-warning mb-3 font-heading flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Invitation details
                  </h4>
                  <ul className="text-state-warning space-y-2 text-sm font-copy">
                    <li>• <strong>Expiration:</strong> Invitations expire after 7 days</li>
                    <li>• <strong>Resending:</strong> You can resend expired invitations</li>
                    <li>• <strong>Canceling:</strong> Pending invitations can be canceled anytime</li>
                    <li>• <strong>Account requirement:</strong> Invitees need a ProsePilot account to join</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Roles and Permissions */}
            <section id="roles-permissions" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <Shield className="w-8 h-8 text-brand-accent mr-4" />
                Roles and permissions
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                ProsePilot uses a role-based permission system to control what team members can do. 
                Understanding these roles helps you maintain security and organize your team effectively.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="border rounded-lg p-6 bg-white">
                  <div className="flex items-center mb-4">
                    <Crown className="w-6 h-6 text-state-warning mr-3" />
                    <h4 className="font-semibold text-base-heading font-heading">Admin</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-state-success mt-0.5 mr-2" />
                      <span className="text-base-paragraph font-copy">Full team management access</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-state-success mt-0.5 mr-2" />
                      <span className="text-base-paragraph font-copy">Invite and remove members</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-state-success mt-0.5 mr-2" />
                      <span className="text-base-paragraph font-copy">Change member roles</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-state-success mt-0.5 mr-2" />
                      <span className="text-base-paragraph font-copy">Create and edit all books</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-state-success mt-0.5 mr-2" />
                      <span className="text-base-paragraph font-copy">Access team settings</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-white">
                  <div className="flex items-center mb-4">
                    <Edit3 className="w-6 h-6 text-state-info mr-3" />
                    <h4 className="font-semibold text-base-heading font-heading">Editor</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-state-success mt-0.5 mr-2" />
                      <span className="text-base-paragraph font-copy">Create new books</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-state-success mt-0.5 mr-2" />
                      <span className="text-base-paragraph font-copy">Edit team books</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-state-success mt-0.5 mr-2" />
                      <span className="text-base-paragraph font-copy">Add comments and annotations</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-state-success mt-0.5 mr-2" />
                      <span className="text-base-paragraph font-copy">Export books</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-state-success mt-0.5 mr-2" />
                      <span className="text-base-paragraph font-copy">View team activity</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-white">
                  <div className="flex items-center mb-4">
                    <Eye className="w-6 h-6 text-state-info mr-3" />
                    <h4 className="font-semibold text-base-heading font-heading">Reader</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-state-success mt-0.5 mr-2" />
                      <span className="text-base-paragraph font-copy">View team books</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-state-success mt-0.5 mr-2" />
                      <span className="text-base-paragraph font-copy">Add comments and annotations</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-state-success mt-0.5 mr-2" />
                      <span className="text-base-paragraph font-copy">Export books (read-only)</span>
                    </div>
                    <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-state-success mt-0.5 mr-2" />
                      <span className="text-base-paragraph font-copy">View team activity</span>
                    </div>
                    <div className="text-state-info text-xs mt-3 font-copy">
                      Perfect for beta readers, clients, or reviewers
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-state-info-light border border-state-info rounded-lg p-6">
                <h4 className="font-semibold text-state-info mb-3 font-heading">💡 Role assignment tips:</h4>
                <ul className="text-state-info space-y-2 text-sm font-copy">
                  <li>• <strong>Start conservative:</strong> You can always promote members later</li>
                  <li>• <strong>Limit admins:</strong> Only give admin access to trusted team leaders</li>
                  <li>• <strong>Use readers for feedback:</strong> Great for beta readers and clients who need view-only access</li>
                  <li>• <strong>Editors for writers:</strong> Most collaborative writers should be editors</li>
                </ul>
              </div>
            </section>

            {/* Collaborative Workflow */}
            <section id="collaborative-workflow" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                  <Zap className="w-8 h-8 text-brand-accent mr-4" />
                Collaborative workflows
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                Effective collaboration requires clear processes and communication. Here are proven workflows 
                for different types of collaborative writing projects.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-4">Workflow 1: Writing Group Collaboration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-3">Setup:</h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm">
                        <li>• One admin (group leader)</li>
                        <li>• All writers as editors</li>
                        <li>• Beta readers as readers</li>
                        <li>• Shared style guidelines</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-3">Process:</h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm">
                        <li>• Create books collaboratively</li>
                        <li>• Use annotations for feedback</li>
                        <li>• Regular review meetings</li>
                        <li>• Version control through exports</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-4">Workflow 2: Client-Agency Model</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-3">Setup:</h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm">
                        <li>• Agency team as admins/editors</li>
                        <li>• Clients as readers</li>
                        <li>• Clear approval process</li>
                        <li>• Defined revision rounds</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-3">Process:</h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm">
                        <li>• Agency creates initial drafts</li>
                        <li>• Clients review and annotate</li>
                        <li>• Revisions based on feedback</li>
                        <li>• Final approval and export</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-4">Workflow 3: Publishing House</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-3">Setup:</h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm">
                        <li>• Editors as admins</li>
                        <li>• Writers as editors</li>
                        <li>• Reviewers as readers</li>
                        <li>• Quality control processes</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-3">Process:</h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm">
                        <li>• Structured content creation</li>
                        <li>• Multi-stage review process</li>
                        <li>• Editorial oversight</li>
                        <li>• Standardized formatting</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Managing Teams */}
            <section id="managing-teams" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <Settings className="w-8 h-8 text-brand-accent mr-4" />
                Managing your team
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                As your team grows and evolves, you'll need to manage members, monitor activity, 
                and maintain team settings. Here's how to keep everything running smoothly.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-4">Team management tasks:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-3">Member Management</h5>
                      <ul className="text-base-paragraph font-copy space-y-2 text-sm">
                        <li>• <strong>Adding members:</strong> Send invitations with appropriate roles</li>
                        <li>• <strong>Role changes:</strong> Promote or demote based on contributions</li>
                        <li>• <strong>Removing members:</strong> Clean removal process for inactive users</li>
                        <li>• <strong>Activity monitoring:</strong> Track who's contributing what</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-3">Team Settings</h5>
                      <ul className="text-base-paragraph font-copy space-y-2 text-sm">
                        <li>• <strong>Team profile:</strong> Update name, description, and logo</li>
                        <li>• <strong>Member limits:</strong> Monitor team size (max 50 members)</li>
                        <li>• <strong>Activity logs:</strong> Review team activity and changes</li>
                        <li>• <strong>Team deletion:</strong> Permanent removal when needed</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-state-warning-light border border-state-warning rounded-lg p-6">
                  <h4 className="font-semibold text-state-warning mb-3 font-heading">⚠️ Important considerations:</h4>
                  <ul className="text-state-warning space-y-2 text-sm font-copy">
                    <li>• <strong>Data ownership:</strong> Team books belong to the team, not individual members</li>
                    <li>• <strong>Member removal:</strong> Removed members lose access to all team content</li>
                    <li>• <strong>Team deletion:</strong> Permanently deletes all team books and data</li>
                    <li>• <strong>Role changes:</strong> Take effect immediately and can't be undone</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section id="best-practices" className="mb-12">
              <h2 className="text-3xl font-bold text-base-heading font-heading mb-6 flex items-center">
                <CheckCircle className="w-8 h-8 text-brand-accent mr-4" />
                Best practices for team collaboration
              </h2>

              <p className="text-base-paragraph font-copy mb-6">
                Follow these proven strategies to create a productive and harmonious collaborative writing environment.
              </p>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h4 className="font-semibold text-base-heading font-heading mb-4">Communication best practices:</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-2 flex items-center">
                        <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
                        Establish clear guidelines
                      </h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm ml-7">
                        <li>• Define writing style and tone standards</li>
                        <li>• Set deadlines and review schedules</li>
                        <li>• Create annotation and feedback protocols</li>
                        <li>• Establish conflict resolution processes</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-2 flex items-center">
                        <FileText className="w-5 h-5 text-state-success mr-2" />
                        Use annotations effectively
                      </h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm ml-7">
                        <li>• Be specific and constructive in feedback</li>
                        <li>• Use consistent annotation categories</li>
                        <li>• Respond to annotations promptly</li>
                        <li>• Mark resolved issues as complete</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-base-heading font-heading mb-2 flex items-center">
                        <Users className="w-5 h-5 text-purple-500 mr-2" />
                        Maintain team cohesion
                      </h5>
                      <ul className="text-base-paragraph font-copy space-y-1 text-sm ml-7">
                        <li>• Regular team check-ins and meetings</li>
                        <li>• Celebrate milestones and achievements</li>
                        <li>• Address conflicts quickly and fairly</li>
                        <li>• Recognize individual contributions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-state-success-light border border-state-success rounded-lg p-6">
                  <h4 className="font-semibold text-state-success mb-3 font-heading">🚀 Pro tips for team success:</h4>
                  <ul className="text-state-success space-y-2 text-sm font-copy">
                    <li>• <strong>Start small:</strong> Begin with a core group and expand gradually</li>
                    <li>• <strong>Document everything:</strong> Keep style guides and processes written down</li>
                    <li>• <strong>Regular backups:</strong> Export important books regularly as backups</li>
                    <li>• <strong>Monitor activity:</strong> Use the activity log to track team engagement</li>
                    <li>• <strong>Feedback culture:</strong> Encourage constructive criticism and continuous improvement</li>
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
                  <p className="text-base-paragraph text-sm font-copy mb-3">Learn the basics of book creation before collaborating with your team.</p>
                  <div className="flex items-center text-brand-accent text-sm">
                    <span>Read article</span>
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </div>
                </Link>
                
                <Link to="/help/ai-best-practices" className="block bg-white shadow-md rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-base-heading font-heading mb-2">Best practices for AI-generated content</h4>
                  <p className="text-base-paragraph text-sm font-copy mb-3">Optimize your team's AI-generated content quality.</p>
                  <div className="flex items-center text-brand-accent text-sm">
                    <span>Read article</span>
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-brand-primary py-12">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-white font-heading mb-4">Ready to start collaborating?</h3>
            <p className="text-white/90 font-copy mb-6">Create your first team and invite collaborators to start writing together.</p>
            <Link to="/workspace/teams">
              <Button className="bg-white text-base-heading hover:bg-gray-100 px-8 py-3">
                Create Team
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}