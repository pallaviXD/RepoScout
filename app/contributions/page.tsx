'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, GitFork, Download, GitBranch, Code2, CircleCheck,
  GitCommit, Upload, GitPullRequest, MessageSquare, CheckCircle2,
  Circle, Copy, Check, ExternalLink, ChevronDown, ChevronRight,
  BookOpen, CircleAlert, TrendingUp, Star, GitMerge, Shield,
  Flame, Zap, Clock, Tag, AlertCircle,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Step {
  id: number;
  num: string;
  title: string;
  description: string;
  icon: React.ElementType;
  requirements: string[];
  commands?: { label: string; code: string }[];
  actionLabel: string;
  actionDoneLabel: string;
  simulatedContent?: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'reposcout_contribution_progress';

const REPO_INFO = {
  owner: 'vercel',
  name: 'next.js',
  fullName: 'vercel/next.js',
  description: 'The React Framework for the Web',
  stars: '131k',
  forks: '23.5k',
  openIssues: '1.2k',
  language: 'TypeScript',
  license: 'MIT',
  updatedAt: '2 hours ago',
  htmlUrl: 'https://github.com/vercel/next.js',
  matchScore: 94,
  tags: ['TypeScript', 'React', 'Next.js', 'Web Development'],
};

const ISSUE_INFO = {
  title: 'Add dark mode support to navigation component',
  number: '#48932',
  status: 'Open',
  labels: ['enhancement', 'good first issue'],
  difficulty: 'Beginner',
  updatedAt: '6 hours ago',
  htmlUrl: 'https://github.com/vercel/next.js/issues/48932',
  body: `Add dark mode support to the navigation component to improve accessibility and provide users with a consistent theme experience.\n\nThe navigation component currently does not respond to system-level dark mode preferences or the manual theme toggle implemented in other parts of the application.`,
  requirements: [
    'Add dark mode styles to all navigation elements',
    'Respect system-level prefers-color-scheme preference',
    'Provide a manual theme toggle control in the navbar',
    'Maintain WCAG AA accessible contrast ratios in both themes',
    'Add unit tests covering both light and dark theme states',
  ],
  acceptance: [
    'Navigation renders correctly in both light and dark mode',
    'Theme toggle persists across page navigations',
    'No flash of unstyled content on theme change',
    'Tests pass in CI environment',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Copy Button Component
// ─────────────────────────────────────────────────────────────────────────────

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-100"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Code Block Component
// ─────────────────────────────────────────────────────────────────────────────

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      {label && (
        <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-2">
          <span className="text-xs text-gray-500 font-medium">{label}</span>
          <CopyButton text={code} />
        </div>
      )}
      {!label && (
        <div className="flex justify-end bg-gray-50 border-b border-gray-200 px-3 py-1.5">
          <CopyButton text={code} />
        </div>
      )}
      <pre className="bg-gray-950 text-emerald-400 text-xs font-mono p-4 overflow-x-auto leading-relaxed">{code}</pre>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step expanded content
// ─────────────────────────────────────────────────────────────────────────────

function StepContent({
  step,
  onComplete,
  isCompleted,
  forkedState,
  setForkedState,
}: {
  step: Step;
  onComplete: () => void;
  isCompleted: boolean;
  forkedState: boolean;
  setForkedState: (v: boolean) => void;
}) {
  const [activeIssueTab, setActiveIssueTab] = useState<'description' | 'criteria' | 'discussion'>('description');
  const [implChecks, setImplChecks] = useState<boolean[]>([false, false, false, false, false]);
  const [prCreated, setPrCreated] = useState(false);

  const toggleCheck = (i: number) => {
    setImplChecks(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  // Step 1 — Understand Issue
  if (step.id === 1) {
    return (
      <div className="space-y-5">
        <div className="flex gap-2 border-b border-gray-100 pb-1">
          {(['description', 'criteria', 'discussion'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveIssueTab(tab)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors capitalize ${
                activeIssueTab === tab
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab === 'criteria' ? 'Acceptance Criteria' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeIssueTab === 'description' && (
            <motion.div key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">{ISSUE_INFO.body}</p>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Requirements</p>
                <ul className="space-y-1.5">
                  {ISSUE_INFO.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
          {activeIssueTab === 'criteria' && (
            <motion.div key="criteria" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ul className="space-y-2">
                {ISSUE_INFO.acceptance.map((a, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          {activeIssueTab === 'discussion' && (
            <motion.div key="disc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {[
                { user: 'maintainer-alex', time: '3 days ago', text: 'This has been requested for a while. The main challenge is ensuring the toggle persists across SSR renders. Consider using a cookie or localStorage.' },
                { user: 'contributor-sam', time: '2 days ago', text: 'I started looking at this. The navigation component is in components/nav/Navbar.tsx. Happy to collaborate if someone else wants to pair on this.' },
                { user: 'maintainer-alex', time: '1 day ago', text: 'Great! Please make sure to follow the theming guide in CONTRIBUTING.md. The design tokens are already set up for dark mode.' },
              ].map((c, i) => (
                <div key={i} className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                    {c.user.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-800">{c.user}</span>
                      <span className="text-[11px] text-gray-400">{c.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-2">
          <button
            onClick={onComplete}
            disabled={isCompleted}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isCompleted
                ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99]'
            }`}
          >
            {isCompleted ? (
              <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Step Completed</span>
            ) : 'Mark as Complete'}
          </button>
        </div>
      </div>
    );
  }

  // Step 2 — Fork
  if (step.id === 2) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          Create your personal fork of <span className="font-mono font-semibold text-gray-900">{REPO_INFO.fullName}</span> under your GitHub account. This gives you a copy you can freely modify.
        </p>
        {!forkedState ? (
          <button
            onClick={() => { setForkedState(true); setTimeout(onComplete, 600); }}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Fork Repository
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800">Repository fork created</p>
              <p className="text-xs text-green-600 font-mono mt-0.5">demo-dev/{REPO_INFO.name}</p>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Step 3 — Clone
  if (step.id === 3) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">Clone your fork to your local development environment using Git.</p>
        <CodeBlock label="Terminal" code={`git clone https://github.com/demo-dev/${REPO_INFO.name}.git\ncd ${REPO_INFO.name}`} />
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
            isCompleted ? 'bg-green-50 text-green-700 border border-green-200 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCompleted ? <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Completed</span> : 'Mark as Complete'}
        </button>
      </div>
    );
  }

  // Step 4 — Branch
  if (step.id === 4) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">Create a dedicated branch for this contribution to keep your work isolated from the main branch.</p>
        <CodeBlock label="Terminal" code={`git remote add upstream https://github.com/${REPO_INFO.fullName}.git\ngit fetch upstream\ngit checkout -b fix/navigation-dark-mode`} />
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
            isCompleted ? 'bg-green-50 text-green-700 border border-green-200 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCompleted ? <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Completed</span> : 'Mark as Complete'}
        </button>
      </div>
    );
  }

  // Step 5 — Implement
  if (step.id === 5) {
    const allChecked = implChecks.every(Boolean);
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">Implement the required changes following the repository coding conventions and design system guidelines.</p>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Implementation Checklist</p>
          {[
            'Review CONTRIBUTING.md guidelines',
            'Identify affected files in components/nav/',
            'Add dark mode CSS variables to navigation styles',
            'Implement theme toggle in Navbar component',
            'Update Storybook stories if applicable',
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => toggleCheck(i)}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              {implChecks[i]
                ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
              }
              <span className={`text-sm ${implChecks[i] ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onComplete}
          disabled={isCompleted || !allChecked}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
            isCompleted
              ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
              : allChecked
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isCompleted
            ? <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Completed</span>
            : allChecked ? 'Mark as Complete' : 'Complete all checklist items first'}
        </button>
      </div>
    );
  }

  // Step 6 — Tests
  if (step.id === 6) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">Run the project test suite to verify your changes don&apos;t introduce regressions.</p>
        <CodeBlock label="Install dependencies" code="npm install" />
        <CodeBlock label="Run tests" code="npm test\n\n# Or run only relevant tests\nnpx jest navigation --watch" />
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
            isCompleted ? 'bg-green-50 text-green-700 border border-green-200 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCompleted ? <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Completed</span> : 'Mark as Complete'}
        </button>
      </div>
    );
  }

  // Step 7 — Commit
  if (step.id === 7) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">Stage your changes and write a clear, descriptive commit message following the Conventional Commits format.</p>
        <CodeBlock label="Terminal" code={`git add .\ngit commit -m "fix: add dark mode support to navigation component\n\nAdds CSS variables and theme toggle for dark mode.\nFixes #${ISSUE_INFO.number.replace('#', '')}"`} />
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
            isCompleted ? 'bg-green-50 text-green-700 border border-green-200 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCompleted ? <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Completed</span> : 'Mark as Complete'}
        </button>
      </div>
    );
  }

  // Step 8 — Push
  if (step.id === 8) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">Push your branch to your fork on GitHub so it&apos;s available for a pull request.</p>
        <CodeBlock label="Terminal" code="git push origin fix/navigation-dark-mode" />
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
            isCompleted ? 'bg-green-50 text-green-700 border border-green-200 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCompleted ? <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Completed</span> : 'Mark as Complete'}
        </button>
      </div>
    );
  }

  // Step 9 — PR
  if (step.id === 9) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">Open a pull request from your fork branch to the upstream repository&apos;s main branch.</p>
        {!prCreated ? (
          <button
            onClick={() => { setPrCreated(true); setTimeout(onComplete, 600); }}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Create Pull Request
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-lg p-4">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">Pull Request Created</p>
                <p className="text-xs text-green-600 mt-0.5">fix: add dark mode support to navigation component</p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">PR Number</span><span className="font-mono font-semibold text-gray-800">#1842</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Base</span><span className="font-mono text-gray-800">vercel/next.js:main</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Compare</span><span className="font-mono text-gray-800">demo-dev:fix/navigation-dark-mode</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Step 10 — Review
  if (step.id === 10) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">Monitor your pull request for review comments and respond promptly to feedback from maintainers.</p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-3">
            <span className="text-sm font-semibold text-gray-800">Pull Request #1842</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3" /> Awaiting Review
            </span>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Title</span>
              <span className="text-gray-800 font-medium">fix: add dark mode support to navigation</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Checks</span>
              <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="w-3.5 h-3.5" /> All checks passing</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Reviewers</span>
              <span className="text-gray-600">1 requested</span>
            </div>
          </div>
        </div>
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
            isCompleted ? 'bg-green-50 text-green-700 border border-green-200 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCompleted ? <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Contribution Complete</span> : 'Mark as Complete'}
        </button>
      </div>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ContributionsPage() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [expandedStep, setExpandedStep] = useState<number>(1);
  const [forkedState, setForkedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as number[];
        setCompletedSteps(new Set(parsed));
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist progress
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedSteps)));
    } catch {}
  }, [completedSteps, hydrated]);

  const steps: Step[] = [
    { id: 1,  num: '01', title: 'Understand the Issue',    icon: FileText,       description: 'Read the issue description, requirements and acceptance criteria before making any changes.',       requirements: ['Understand expected behavior', 'Review related discussions', 'Identify affected files', 'Check existing implementation', 'Confirm acceptance criteria'], actionLabel: 'Mark as Complete', actionDoneLabel: 'Completed' },
    { id: 2,  num: '02', title: 'Fork Repository',         icon: GitFork,        description: 'Create your personal fork of the repository under your GitHub account.',                            requirements: ['Sign in to GitHub', 'Navigate to the repository', 'Click the Fork button', 'Confirm fork creation'],             actionLabel: 'Fork Repository',  actionDoneLabel: 'Forked' },
    { id: 3,  num: '03', title: 'Clone Repository',        icon: Download,       description: 'Clone your fork to your local development environment.',                                             requirements: ['Copy your fork URL', 'Run git clone command', 'Verify directory was created'],                                     actionLabel: 'Mark as Complete', actionDoneLabel: 'Completed' },
    { id: 4,  num: '04', title: 'Create Branch',           icon: GitBranch,      description: 'Create a dedicated branch for your contribution to keep work isolated.',                            requirements: ['Add upstream remote', 'Fetch latest changes', 'Create feature branch from main'],                                 actionLabel: 'Mark as Complete', actionDoneLabel: 'Completed' },
    { id: 5,  num: '05', title: 'Implement Changes',       icon: Code2,          description: 'Make the required changes following repository conventions and design system guidelines.',            requirements: ['Review coding guidelines', 'Identify affected files', 'Implement changes', 'Add tests'],                          actionLabel: 'Mark as Complete', actionDoneLabel: 'Completed' },
    { id: 6,  num: '06', title: 'Run Tests',               icon: CircleCheck,    description: 'Run the project test suite and verify your changes do not introduce regressions.',                  requirements: ['Install dependencies', 'Run full test suite', 'Fix any failing tests', 'Check code coverage'],                   actionLabel: 'Mark as Complete', actionDoneLabel: 'Completed' },
    { id: 7,  num: '07', title: 'Commit Changes',          icon: GitCommit,      description: 'Stage your changes and write a clear commit message following Conventional Commits.',               requirements: ['Stage changed files', 'Write descriptive commit message', 'Reference issue number'],                             actionLabel: 'Mark as Complete', actionDoneLabel: 'Completed' },
    { id: 8,  num: '08', title: 'Push Branch',             icon: Upload,         description: 'Push your branch to your fork on GitHub.',                                                          requirements: ['Verify remote is set correctly', 'Push branch to origin', 'Confirm branch appears on GitHub'],                  actionLabel: 'Mark as Complete', actionDoneLabel: 'Completed' },
    { id: 9,  num: '09', title: 'Open Pull Request',       icon: GitPullRequest, description: 'Create a pull request against the upstream repository with a clear description.',                   requirements: ['Write a clear PR title', 'Describe changes in body', 'Link the issue', 'Request reviewers'],                    actionLabel: 'Create Pull Request', actionDoneLabel: 'PR Created' },
    { id: 10, num: '10', title: 'Track Review',            icon: MessageSquare,  description: 'Monitor feedback and respond to review comments promptly.',                                          requirements: ['Check CI status', 'Respond to reviewer comments', 'Push requested changes', 'Get approval & merge'],            actionLabel: 'Mark as Complete', actionDoneLabel: 'Completed' },
  ];

  const completedCount = completedSteps.size;
  const progressPct = Math.round((completedCount / steps.length) * 100);

  const markComplete = useCallback((stepId: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(stepId);
      return next;
    });
    // Auto-advance to next step
    const nextId = stepId + 1;
    if (nextId <= 10) {
      setTimeout(() => setExpandedStep(nextId), 300);
    }
  }, []);

  const toggleStep = (stepId: number) => {
    setExpandedStep(prev => prev === stepId ? 0 : stepId);
  };

  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <Link href="/explore" className="hover:text-blue-600 transition-colors">Contributions</Link>
              <span>/</span>
              <span className="text-gray-600">Workspace</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Contribution Workspace</h1>
            <p className="text-sm text-gray-500 mt-1">Follow a guided workflow to turn an open-source issue into a pull request.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={REPO_INFO.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Open on GitHub
            </a>
          </div>
        </div>

        {/* ── Repository Header Card ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <h2 className="text-base font-bold text-gray-900">
                  <span className="text-gray-400 font-medium">{REPO_INFO.owner}</span>
                  <span className="text-gray-300 mx-1">/</span>
                  <span>{REPO_INFO.name}</span>
                </h2>
              </div>
              <p className="text-sm text-gray-500">{REPO_INFO.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {REPO_INFO.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">{tag}</span>
                ))}
              </div>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <div className="inline-block bg-green-50 border border-green-200 rounded-xl px-5 py-3">
                <p className="text-xs text-green-600 font-medium uppercase tracking-wider">Match Score</p>
                <p className="text-3xl font-bold text-green-700 leading-tight">{REPO_INFO.matchScore}%</p>
                <p className="text-xs text-green-600">Excellent Match</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main 2-col layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── CENTER: Workflow ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Workflow Header + Progress */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Contribution Workflow</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Complete each step to prepare and submit your contribution.</p>
                </div>
                <span className="text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                  {completedCount} of {steps.length} steps
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Progress</span>
                  <span className="font-semibold text-gray-600">{progressPct}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
              {completedCount === 10 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-lg p-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Contribution Complete!</p>
                    <p className="text-xs text-green-600">All 10 steps finished. Your pull request is open for review.</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Steps List */}
            <div className="space-y-2">
              {steps.map((step) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(step.id);
                const isExpanded = expandedStep === step.id;
                const isNext = !isCompleted && step.id === (completedCount + 1);

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: step.id * 0.03 }}
                    className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-colors ${
                      isExpanded ? 'border-blue-300' : isCompleted ? 'border-gray-200' : isNext ? 'border-blue-200' : 'border-gray-200'
                    }`}
                  >
                    {/* Step Row Header */}
                    <button
                      onClick={() => toggleStep(step.id)}
                      className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      {/* Status indicator */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                        isCompleted
                          ? 'bg-green-50 border-green-200'
                          : isExpanded || isNext
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        {isCompleted
                          ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                          : <Icon className={`w-4 h-4 ${isExpanded || isNext ? 'text-blue-600' : 'text-gray-400'}`} />
                        }
                      </div>

                      {/* Step info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-gray-400">{step.num}</span>
                          <span className={`text-sm font-semibold ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                            {step.title}
                          </span>
                          {isNext && !isCompleted && (
                            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md">Current</span>
                          )}
                        </div>
                        {!isExpanded && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{step.description}</p>
                        )}
                      </div>

                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-gray-100 px-4 pb-4 pt-4 space-y-4">
                            {/* Requirements */}
                            <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Requirements</p>
                              {step.requirements.map((r, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                                  {r}
                                </div>
                              ))}
                            </div>
                            {/* Per-step interactive content */}
                            <StepContent
                              step={step}
                              onComplete={() => markComplete(step.id)}
                              isCompleted={isCompleted}
                              forkedState={forkedState}
                              setForkedState={setForkedState}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-4">

            {/* Issue Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <CircleAlert className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-800">Issue Details</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{ISSUE_INFO.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-mono text-gray-500">{ISSUE_INFO.number}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {ISSUE_INFO.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ISSUE_INFO.labels.map(l => (
                    <span key={l} className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">{l}</span>
                  ))}
                </div>
                <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Difficulty</span>
                    <span className="font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">{ISSUE_INFO.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated</span>
                    <span className="text-gray-700">{ISSUE_INFO.updatedAt}</span>
                  </div>
                </div>
                <a
                  href={ISSUE_INFO.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Issue
                </a>
              </div>
            </div>

            {/* Repository Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-800">Repository</h3>
              </div>
              <div className="space-y-2.5">
                <p className="text-sm font-semibold text-gray-900 font-mono">{REPO_INFO.fullName}</p>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5"><Star className="w-3 h-3" /> Stars</span>
                    <span className="font-semibold text-gray-800">{REPO_INFO.stars}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5"><GitMerge className="w-3 h-3" /> Forks</span>
                    <span className="font-semibold text-gray-800">{REPO_INFO.forks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5"><AlertCircle className="w-3 h-3" /> Open Issues</span>
                    <span className="font-semibold text-gray-800">{REPO_INFO.openIssues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5"><Tag className="w-3 h-3" /> Language</span>
                    <span className="font-semibold text-gray-800">{REPO_INFO.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> License</span>
                    <span className="font-semibold text-gray-800">{REPO_INFO.license}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Updated</span>
                    <span className="font-semibold text-gray-800">{REPO_INFO.updatedAt}</span>
                  </div>
                </div>
                <a
                  href={REPO_INFO.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors mt-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Repository
                </a>
              </div>
            </div>

            {/* Contribution Progress */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-800">Your Progress</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-700">8</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Level 8</p>
                    <p className="text-[11px] text-gray-400">Intermediate Contributor</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> XP</span>
                    <span className="font-semibold text-gray-700">425 / 600</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '71%' }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                  <span className="flex items-center gap-1.5 text-gray-500"><Flame className="w-3.5 h-3.5 text-orange-400" /> Current Streak</span>
                  <span className="font-bold text-gray-800">12 days</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
