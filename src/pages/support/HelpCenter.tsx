import { useState } from 'react';

interface HelpCenterProps {
  onNavigate?: (page: string) => void;
}

type Article = {
  id: string;
  title: string;
  summary: string;
  content: string;
};

type Category = {
  title: string;
  icon: string;
  articles: Article[];
};

const CATEGORIES: Category[] = [
  {
    title: 'Getting Started',
    icon: '🚀',
    articles: [
      {
        id: 'create-account',
        title: 'How to create an account',
        summary: 'Step-by-step registration flow for teachers and students.',
        content: `1. Click Sign up and choose Teacher or Student.\n2. Complete the multi-step form (personal, credentials, experience, institution).\n3. On final step (teachers), select School or College — this choice customizes your dashboard tools.\n4. Click Complete Registration, then sign in with your credentials.\n\nIf you have trouble registering, ensure your email is valid and check spam for confirmation emails.`
      },
      {
        id: 'setup-profile',
        title: 'Setting up your profile',
        summary: 'Tips to complete a strong teacher profile.',
        content: `Add a profile photo, your correct name and contact details, list the subjects you teach and the grades/streams.\n\nWhy: this information helps the AI recommend suitable materials and tailor templates.\n\nWhere: Dashboard → Profile (use Save to persist).`
      },
      {
        id: 'navigate-dashboard',
        title: 'Navigating the dashboard',
        summary: 'Overview of the main dashboard areas and what they do.',
        content: `Top navigation: logo, quick actions, sign out.\nSidebar (desktop) or mobile menu: Dashboard, Content, Material, Knowledge, Visual Aid, Planner, Games, Audio.\nMain pane: shows the selected tool or a summary view.\n\nTip: Use the Dashboard home to access quick actions and recent items.`
      },
      {
        id: 'first-steps',
        title: 'First steps guide',
        summary: 'A short checklist to get started in 10 minutes.',
        content: `1. Complete your profile. 2. Create a sample lesson with Content Generator. 3. Assign it to a test student or group. 4. Run one assessment to see analytics. 5. Review reports and adjust.`
      }
    ]
  },
  {
    title: 'For Students',
    icon: '📚',
    articles: [
      {
        id: 'access-materials',
        title: 'Accessing learning materials',
        summary: 'Where to find lessons, downloads and resources.',
        content: `Open Student Dashboard → Lessons or Roadmap.\nEach lesson page includes downloadable resources, reading material and assessments.\nUse the filter in Lessons to find topics by subject, grade or keyword.`
      },
      {
        id: 'track-progress',
        title: 'Tracking your progress',
        summary: 'Understand Roadmap, progress bars and completion metrics.',
        content: `Roadmap shows weekly progression and completed lessons.\nProgress bars show percentage complete.\nTeachers can view student progress and provide feedback via the Dashboard → Analytics.`
      },
      {
        id: 'assessments',
        title: 'Taking assessments',
        summary: 'Start and submit assessments safely.',
        content: `Open the lesson and click Start Assessment.\nFollow on-screen prompts. Submissions are autosaved where applicable.\nContact your teacher if you experience issues or missing submissions.`
      },
      {
        id: 'ai-recommendations',
        title: 'Getting AI recommendations',
        summary: 'How to request personalized study suggestions.',
        content: `Use the Recommend action inside lessons or content pages.\nProvide short context for best results (e.g., 'Beginner level, focus on core concepts').\nAI recommendations are suggestions — review them before applying.`
      }
    ]
  },
  {
    title: 'For Teachers',
    icon: '👨‍🏫',
    articles: [
      {
        id: 'creating-courses',
        title: 'Creating courses',
        summary: 'Steps to author and publish a course module.',
        content: `1. Dashboard → Content Generator or Material Base.\n2. Choose language, grade/stream and content type.\n3. Enter topic and generate content.\n4. Edit and Save as Course Module.\n5. Publish and assign to students or groups.`
      },
      {
        id: 'managing-students',
        title: 'Managing students',
        summary: 'Add, group and assign students efficiently.',
        content: `Add students manually or import CSV via Profile → Class Management.\nCreate groups for pacing and differentiation.\nAssign courses or lessons to groups and monitor progress from Analytics.`
      },
      {
        id: 'grading-feedback',
        title: 'Grading and feedback',
        summary: 'Use rubrics and AI to speed up grading.',
        content: `Open student submission → use rubric templates.\nAI-suggested grades are available as a draft — always review before finalizing.\nProvide inline comments and save to publish feedback.`
      },
      {
        id: 'analytics-reports',
        title: 'Analytics and reports',
        summary: 'Generate performance reports and export data.',
        content: `Dashboard → Analytics.\nUse filters for date ranges, classes and specific assessments.\nExport CSV/PDF for administrative use.\nUse reports to identify learning gaps and plan remediation.`
      }
    ]
  },
  {
    title: 'Technical Support',
    icon: '🔧',
    articles: [
      {
        id: 'login-issues',
        title: 'Troubleshooting login issues',
        summary: 'Common fixes for sign-in problems.',
        content: `1. Verify email and password.\n2. Use Forgot Password to reset credentials.\n3. Clear cache/cookies and try again.\n4. Check browser console for network errors and forward the screenshot to support.`
      },
      {
        id: 'browser-compat',
        title: 'Browser compatibility',
        summary: 'Recommended browsers and settings.',
        content: `Recommended: Latest Chrome or Firefox.\nEnable cookies and localStorage.\nDisable aggressive ad-blockers that may block assets.\nIf mobile, use the device's modern browser.`
      },
      {
        id: 'reset-password',
        title: 'Resetting your password',
        summary: 'How to securely reset your password.',
        content: `Click Forgot password on the login page and follow the email link.\nIf you don't receive email, check spam and verify your registered email address.\nFor persistent issues, contact support.`
      },
      {
        id: 'account-recovery',
        title: 'Account recovery',
        summary: 'What to do if you lose access to your account.',
        content: `Provide your registered email, institution name and proof of identity to support.\nSupport may ask for verification details to restore access.\nWe recommend keeping account recovery details up to date in Profile.`
      }
    ]
  }
];

export default function HelpCenter({ onNavigate }: HelpCenterProps) {
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  const toggleArticle = (id: string) => {
    setOpenArticle(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Help <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">Center</span>
          </h1>
          <p className="text-gray-400 text-lg mb-6">Find quick answers and detailed guides for students and teachers.</p>

          {/* Search removed per request */}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {CATEGORIES.map((category) => (
            <section key={category.title} className="self-start bg-dark-secondary border border-gray-800 rounded-lg p-6 hover:border-accent transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{category.icon}</span>
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>

              <div className="space-y-3">
                {category.articles.map(article => (
                  <div key={article.id} className="border border-transparent hover:border-gray-700 rounded-md">
                    <button
                      onClick={() => toggleArticle(article.id)}
                      aria-expanded={openArticle === article.id}
                      aria-controls={`${article.id}-panel`}
                      className="w-full text-left flex items-start gap-3 p-3 rounded-md hover:bg-dark-tertiary transition-colors"
                    >
                      <span className="text-accent mt-1">→</span>
                      <div>
                        <div className="font-medium text-white">{article.title}</div>
                        {openArticle === article.id && (
                          <div id={`${article.id}-panel`} className="mt-3 text-sm text-gray-300">
                            <p className="text-gray-300 mb-3">{article.summary}</p>
                            <div className="whitespace-pre-line">{article.content}</div>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 bg-dark-secondary border border-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
          <p className="text-gray-400 mb-6">Our support team is here to assist you — share your issue and a screenshot for faster resolution.</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => onNavigate?.('contact')}
              className="px-8 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all"
              aria-label="Go to Contact Support page"
            >
              Contact Support
            </button>

           
          </div>
        </div>
      </div>
    </div>
  );
}
