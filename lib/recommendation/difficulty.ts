import { GitHubIssue } from '../types';
import { normalizeGitHubLabels } from '../github/normalize';

/**
 * Calculates a deterministic RepoScout Estimated Difficulty score (1 to 5 stars & Beginner/Intermediate/Advanced category)
 */
export interface DifficultyCalculation {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number; // 1 to 5 stars
  reasons: string[];
}

export function calculateIssueDifficulty(issue: Partial<GitHubIssue>): DifficultyCalculation {
  let difficultyScore = 50; // Base score (0 - 100)
  const reasons: string[] = [];

  const rawLabels = issue.labels || [];
  const normalized = normalizeGitHubLabels(rawLabels);

  // 1. Label Signals
  if (normalized.isGoodFirstIssue) {
    difficultyScore -= 30;
    reasons.push('Has Good First Issue label');
  }
  if (normalized.isDocumentation) {
    difficultyScore -= 20;
    reasons.push('Documentation related issue');
  }
  if (normalized.isHelpWanted) {
    difficultyScore -= 10;
    reasons.push('Explicitly seeking community help');
  }

  // Check explicit hard/advanced labels
  const labelNames = rawLabels.map((l) => (typeof l === 'string' ? l : l.name).toLowerCase());
  if (labelNames.some((l) => l.includes('hard') || l.includes('complex') || l.includes('core'))) {
    difficultyScore += 25;
    reasons.push('Tagged as complex/core functionality');
  }

  // 2. Comment Count Signals (High discussion often indicates complex architectural debate)
  const comments = issue.commentsCount || 0;
  if (comments === 0) {
    difficultyScore -= 5;
    reasons.push('Fresh issue with no existing comments');
  } else if (comments > 15) {
    difficultyScore += 20;
    reasons.push(`High discussion volume (${comments} comments)`);
  } else if (comments > 5) {
    difficultyScore += 10;
  }

  // 3. Issue Description Length / Complexity
  const bodyLength = (issue.body || '').length;
  if (bodyLength > 3000) {
    difficultyScore += 15;
    reasons.push('Detailed, long issue specification');
  } else if (bodyLength > 0 && bodyLength < 300) {
    difficultyScore -= 10;
    reasons.push('Concise task description');
  }

  // Clamp score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, difficultyScore));

  let difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  let rating: number;

  if (finalScore <= 35) {
    difficulty = 'Beginner';
    rating = finalScore <= 20 ? 1 : 2;
  } else if (finalScore <= 70) {
    difficulty = 'Intermediate';
    rating = finalScore <= 50 ? 3 : 4;
  } else {
    difficulty = 'Advanced';
    rating = 5;
  }

  return {
    difficulty,
    rating,
    reasons,
  };
}
