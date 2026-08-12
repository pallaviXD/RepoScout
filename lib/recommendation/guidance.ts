import { ContributionType, ContributionGuidance, StepGuidance } from '../types';

export function getDeterministicContributionGuidance(
  contributionType: ContributionType = 'BUG_FIX',
  issueTitle: string = 'Issue'
): ContributionGuidance {
  const commonChecklist: StepGuidance[] = [
    {
      step: 1,
      title: 'Read Contribution Guidelines',
      description: 'Locate CONTRIBUTING.md or CODE_OF_CONDUCT.md in the repo root to follow repo-specific PR guidelines.',
      iconName: 'FileText',
    },
    {
      step: 2,
      title: 'Check Assignment Status',
      description: 'Review comments to ensure no other contributor is currently assigned or actively working on this issue.',
      iconName: 'UserCheck',
    },
    {
      step: 3,
      title: 'Understand Requirements',
      description: `Read the issue description carefully: "${issueTitle}". Clarify any questions in comments before coding.`,
      iconName: 'HelpCircle',
    },
    {
      step: 4,
      title: 'Fork and Clone Repository',
      description: 'Create your personal GitHub fork of the repository and clone it locally using git clone.',
      iconName: 'GitFork',
    },
    {
      step: 5,
      title: 'Create a Topic Branch',
      description: 'Checkout a clean branch from main/master (e.g., git checkout -b fix/issue-short-title).',
      iconName: 'GitBranch',
    },
  ];

  let specificSteps: StepGuidance[] = [];
  let overview = '';

  switch (contributionType) {
    case 'BUG_FIX':
      overview = 'Focus on reproducing the unexpected behavior first, isolating the root cause, and writing a minimal regression test.';
      specificSteps = [
        {
          step: 6,
          title: 'Reproduce Bug Locally',
          description: 'Follow the steps to reproduce in the issue report. Verify the failure in local test suite.',
          iconName: 'Bug',
        },
        {
          step: 7,
          title: 'Locate Target Code',
          description: 'Use text search in your editor to locate the relevant components, functions, or modules.',
          iconName: 'Search',
        },
        {
          step: 8,
          title: 'Implement Bug Fix',
          description: 'Apply the minimal code change necessary to resolve the bug without breaking existing contracts.',
          iconName: 'Code',
        },
        {
          step: 9,
          title: 'Add Regression Unit Test',
          description: 'Write a unit/integration test that fails without your fix and passes with your fix.',
          iconName: 'CheckSquare',
        },
      ];
      break;

    case 'DOCUMENTATION':
      overview = 'Ensure clarity, accurate formatting, correct code snippets, and updated references for developers.';
      specificSteps = [
        {
          step: 6,
          title: 'Locate Target Documentation Files',
          description: 'Find affected markdown (.md, .mdx) or docstring files in docs/ or README.md.',
          iconName: 'FileText',
        },
        {
          step: 7,
          title: 'Verify Links & Code Snippets',
          description: 'Test all code examples locally to ensure syntax and commands execute correctly.',
          iconName: 'CheckCircle',
        },
        {
          step: 8,
          title: 'Check Markdown Formatting',
          description: 'Preview rendering in your editor or run doc linters if available.',
          iconName: 'Eye',
        },
        {
          step: 9,
          title: 'Commit Documentation Changes',
          description: 'Use clear commit message format (e.g., docs: update installation steps in README).',
          iconName: 'GitCommit',
        },
      ];
      break;

    case 'FEATURE':
      overview = 'Implement new functionality following the codebase patterns, modular architecture, and API design principles.';
      specificSteps = [
        {
          step: 6,
          title: 'Design Component Architecture',
          description: 'Plan function signatures, state management, and props to match existing project conventions.',
          iconName: 'Layers',
        },
        {
          step: 7,
          title: 'Implement Feature Code',
          description: 'Write clean, modular code with clear comments and appropriate error handling.',
          iconName: 'Code',
        },
        {
          step: 8,
          title: 'Add Full Test Coverage',
          description: 'Write unit tests for happy path and edge case scenarios.',
          iconName: 'ShieldCheck',
        },
        {
          step: 9,
          title: 'Update Feature Documentation',
          description: 'Document any new props, parameters, or configurations in relevant doc files.',
          iconName: 'BookOpen',
        },
      ];
      break;

    case 'TESTING':
      overview = 'Improve test coverage, fix flaky tests, or add new integration test cases for critical paths.';
      specificSteps = [
        {
          step: 6,
          title: 'Identify Untested Branches',
          description: 'Run test coverage reports (e.g., npm test -- --coverage) to spot untested logic.',
          iconName: 'BarChart',
        },
        {
          step: 7,
          title: 'Write Test Cases',
          description: 'Use established test runner assertions (Jest/Vitest/PyTest) to add missing assertions.',
          iconName: 'CheckSquare',
        },
        {
          step: 8,
          title: 'Verify Test Speed & Isolation',
          description: 'Ensure tests do not leak global state and execute fast in CI environments.',
          iconName: 'Zap',
        },
        {
          step: 9,
          title: 'Commit Tests',
          description: 'Format commit message cleanly (e.g., test: add unit tests for user auth flow).',
          iconName: 'GitCommit',
        },
      ];
      break;

    default:
      overview = 'Follow systematic steps: reproduce, locate affected files, implement minimal changes, test thoroughly, and submit PR.';
      specificSteps = [
        {
          step: 6,
          title: 'Locate Affected Files',
          description: 'Find target components or modules in the repository codebase.',
          iconName: 'Folder',
        },
        {
          step: 7,
          title: 'Implement Changes',
          description: 'Make required modifications with attention to style guide standards.',
          iconName: 'Code',
        },
        {
          step: 8,
          title: 'Run Local Test Suite',
          description: 'Execute npm test or project build scripts to verify zero regressions.',
          iconName: 'Play',
        },
        {
          step: 9,
          title: 'Prepare Clean Commit',
          description: 'Commit with descriptive message linking issue number (e.g., Fixes #123).',
          iconName: 'GitCommit',
        },
      ];
      break;
  }

  const finalStep: StepGuidance = {
    step: 10,
    title: 'Open Pull Request on GitHub',
    description: 'Push your branch to your fork and submit a PR to upstream main branch with description linking issue #.',
    iconName: 'GitPullRequest',
  };

  const checklist = [...commonChecklist, ...specificSteps, finalStep];

  const generalBestPractices = [
    'Always link the issue in your PR description using "Fixes #issue_number" or "Closes #issue_number".',
    'Keep your PR concise and focused on one specific issue.',
    'Be polite and receptive to maintainer feedback during code review.',
    'Ensure all automated CI checks and linters pass before requesting review.',
  ];

  return {
    title: `Contribution Guidance for ${contributionType.replace('_', ' ')}`,
    contributionType,
    overview,
    checklist,
    generalBestPractices,
  };
}
