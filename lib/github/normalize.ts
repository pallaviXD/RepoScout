export interface NormalizedLabels {
  isGoodFirstIssue: boolean;
  isHelpWanted: boolean;
  isDocumentation: boolean;
  estimatedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

const GOOD_FIRST_ISSUE_PATTERNS = [
  'good first issue',
  'good-first-issue',
  'good_first_issue',
  'starter',
  'starter issue',
  'beginner',
  'beginner friendly',
  'first-timers-only',
  'easy',
  'level:easy',
  'e-easy',
  'd:easy',
];

const HELP_WANTED_PATTERNS = [
  'help wanted',
  'help-wanted',
  'help_wanted',
  'contributions welcome',
  'up for grabs',
];

const DOCUMENTATION_PATTERNS = [
  'documentation',
  'docs',
  'doc',
  'type:docs',
  'area:docs',
];

const BEGINNER_PATTERNS = [
  'beginner',
  'easy',
  'good first issue',
  'good-first-issue',
  'starter',
  'difficulty: easy',
  'difficulty/easy',
  'low hanging fruit',
];

const ADVANCED_PATTERNS = [
  'advanced',
  'hard',
  'difficulty: hard',
  'difficulty/hard',
  'complex',
  'expert',
  'core',
  'architecture',
];

/**
 * Normalizes an array of raw GitHub label strings or label objects.
 */
export function normalizeGitHubLabels(labels: (string | { name: string })[]): NormalizedLabels {
  const rawNames = labels.map((l) => (typeof l === 'string' ? l : l.name).toLowerCase().trim());

  let isGoodFirstIssue = false;
  let isHelpWanted = false;
  let isDocumentation = false;
  let isBeginnerLabel = false;
  let isAdvancedLabel = false;

  for (const name of rawNames) {
    if (GOOD_FIRST_ISSUE_PATTERNS.some((pattern) => name.includes(pattern))) {
      isGoodFirstIssue = true;
    }
    if (HELP_WANTED_PATTERNS.some((pattern) => name.includes(pattern))) {
      isHelpWanted = true;
    }
    if (DOCUMENTATION_PATTERNS.some((pattern) => name.includes(pattern))) {
      isDocumentation = true;
    }
    if (BEGINNER_PATTERNS.some((pattern) => name.includes(pattern))) {
      isBeginnerLabel = true;
    }
    if (ADVANCED_PATTERNS.some((pattern) => name.includes(pattern))) {
      isAdvancedLabel = true;
    }
  }

  let estimatedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
  if (isBeginnerLabel || isGoodFirstIssue || isDocumentation) {
    estimatedDifficulty = 'Beginner';
  } else if (isAdvancedLabel) {
    estimatedDifficulty = 'Advanced';
  }

  // Extract clean tech/category tags from labels
  const tags: string[] = [];
  rawNames.forEach((label) => {
    if (label.startsWith('lang:') || label.startsWith('area:') || label.startsWith('component:')) {
      const clean = label.split(':')[1]?.trim();
      if (clean) tags.push(clean);
    }
  });

  return {
    isGoodFirstIssue,
    isHelpWanted,
    isDocumentation,
    estimatedDifficulty,
    tags,
  };
}
