import { UserPreferences, GitHubIssue, MatchScoreResult } from '../types';
import { calculateIssueDifficulty } from './difficulty';
import { normalizeGitHubLabels } from '../github/normalize';

/**
 * Pure deterministic match scoring engine.
 * Calculates match percentage (0-100%) and breakdown based on strict formula:
 *
 * Skill Match          35%
 * Experience Match     20%
 * Interest Match       15%
 * Issue Difficulty     10%
 * Repository Activity  10%
 * Technology Match     10%
 */
export function calculateMatchScore(
  userPref: UserPreferences,
  issue: Partial<GitHubIssue>
): MatchScoreResult {
  const reasons: string[] = [];
  const learningOpportunitiesSet = new Set<string>();

  // Extract issue technology signals
  const repoLanguage = (issue.repository?.language || '').toLowerCase();
  const rawLabels = issue.labels || [];
  const normalized = normalizeGitHubLabels(rawLabels);
  const labelNames = rawLabels.map((l) => (typeof l === 'string' ? l : l.name).toLowerCase());

  const userSkillsLower = (userPref.skills || []).map((s) => s.toLowerCase());
  const userInterestsLower = (userPref.interests || []).map((i) => i.toLowerCase());

  // 1. Skill Match (Max 35 points)
  let skillPoints = 0;
  let matchedSkillsCount = 0;

  if (repoLanguage && userSkillsLower.includes(repoLanguage)) {
    skillPoints += 20;
    matchedSkillsCount++;
    reasons.push(`Primary language (${issue.repository?.language}) matches your skills`);
  } else if (repoLanguage) {
    learningOpportunitiesSet.add(issue.repository?.language || '');
  }

  // Check matching labels/tags with user skills
  for (const skill of userSkillsLower) {
    if (labelNames.some((l) => l.includes(skill))) {
      skillPoints += 15;
      matchedSkillsCount++;
      const capitalized = skill.charAt(0).toUpperCase() + skill.slice(1);
      reasons.push(`Skill (${capitalized}) matches issue labels`);
      break;
    }
  }

  // If user has skills and language matched, cap at 35
  const skillMatch = Math.min(35, Math.max(matchedSkillsCount > 0 ? 15 : 0, skillPoints));

  // 2. Experience Match (Max 20 points)
  const diffCalc = calculateIssueDifficulty(issue);
  let experienceMatch = 10;

  const userExp = userPref.experienceLevel || 'BEGINNER';
  if (userExp === 'BEGINNER' && diffCalc.difficulty === 'Beginner') {
    experienceMatch = 20;
    reasons.push('Beginner issue difficulty matches your experience level');
  } else if (userExp === 'INTERMEDIATE' && diffCalc.difficulty === 'Intermediate') {
    experienceMatch = 20;
    reasons.push('Intermediate issue difficulty matches your experience level');
  } else if (userExp === 'ADVANCED' && (diffCalc.difficulty === 'Advanced' || diffCalc.difficulty === 'Intermediate')) {
    experienceMatch = 20;
    reasons.push('Issue difficulty matches your advanced experience');
  } else if (userExp === 'BEGINNER' && diffCalc.difficulty === 'Intermediate') {
    experienceMatch = 12;
    reasons.push('Mild challenge: issue is Intermediate for a Beginner');
  } else {
    experienceMatch = 8;
  }

  // 3. Interest Match (Max 15 points)
  let interestMatch = 0;
  const repoTopics = ((issue.repository as any)?.topics || []).map((t: string) => t.toLowerCase());

  for (const interest of userInterestsLower) {
    if (repoTopics.some((t: string) => t.includes(interest) || interest.includes(t))) {
      interestMatch = 15;
      reasons.push(`Repository topic matches your interest in ${interest}`);
      break;
    }
    if (labelNames.some((l) => l.includes(interest))) {
      interestMatch = 15;
      reasons.push(`Issue relates to your interest in ${interest}`);
      break;
    }
  }
  if (interestMatch === 0 && userInterestsLower.length > 0) {
    interestMatch = 5; // Base fallback interest score
  }

  // 4. Issue Difficulty Score (Max 10 points)
  let difficultyMatch = 10;
  if (normalized.isGoodFirstIssue) {
    difficultyMatch = 10;
    reasons.push('Has Good First Issue tag for easier onboarding');
  } else if (diffCalc.difficulty === 'Beginner') {
    difficultyMatch = 9;
  } else if (diffCalc.difficulty === 'Intermediate') {
    difficultyMatch = 7;
  } else {
    difficultyMatch = 5;
  }

  // 5. Repository Activity (Max 10 points)
  let repositoryActivity = 8; // Default active score
  const updatedAt = issue.updatedAt ? new Date(issue.updatedAt) : new Date();
  const daysOld = Math.floor((Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
  if (daysOld <= 7) {
    repositoryActivity = 10;
    reasons.push('Repository updated recently (within 7 days)');
  } else if (daysOld <= 30) {
    repositoryActivity = 8;
  } else {
    repositoryActivity = 5;
  }

  // 6. Technology Match (Max 10 points)
  let technologyMatch = 5;
  if (repoLanguage) {
    technologyMatch = 10;
  }

  // Calculate Total Score (100% max)
  const totalScore = Math.min(
    100,
    Math.round(
      skillMatch +
        experienceMatch +
        interestMatch +
        difficultyMatch +
        repositoryActivity +
        technologyMatch
    )
  );

  // Fill learning opportunities
  if (repoLanguage && !userSkillsLower.includes(repoLanguage)) {
    learningOpportunitiesSet.add(issue.repository?.language || '');
  }

  return {
    totalScore,
    skillMatch,
    experienceMatch,
    interestMatch,
    difficultyMatch,
    repositoryActivity,
    technologyMatch,
    difficulty: diffCalc.difficulty,
    reasons,
    learningOpportunities: Array.from(learningOpportunitiesSet),
  };
}
