import { describe, it, expect } from 'vitest';
import { calculateMatchScore } from '../../lib/recommendation/matchScore';
import { UserPreferences, GitHubIssue } from '../../lib/types';

describe('Deterministic Match Scoring Engine', () => {

  const sampleUser: UserPreferences = {
    skills: ['TypeScript', 'React'],
    experienceLevel: 'BEGINNER',
    interests: ['Web Development', 'Accessibility'],
    contributionTypes: ['BUG_FIX'],
  };

  it('should return high score (near 90-100%) for matching language, skills, beginner difficulty & interests', () => {
    const perfectIssue: Partial<GitHubIssue> = {
      title: 'Fix keyboard accessibility in navbar component',
      commentsCount: 2,
      updatedAt: new Date().toISOString(),
      labels: [
        { id: 1, name: 'good first issue', color: '22c55e' },
        { id: 2, name: 'react', color: '61dafb' },
        { id: 3, name: 'accessibility', color: 'ffaa00' },
      ],
      repository: {
        owner: 'vercel',
        name: 'next.js',
        fullName: 'vercel/next.js',
        language: 'TypeScript',
      },
    };

    const result = calculateMatchScore(sampleUser, perfectIssue);

    expect(result.totalScore).toBeGreaterThanOrEqual(80);
    expect(result.difficulty).toBe('Beginner');
    expect(result.reasons.some((r) => r.includes('TypeScript'))).toBe(true);
    expect(result.reasons.some((r) => r.includes('Beginner'))).toBe(true);
  });

  it('should generate lower score when user skills do not match issue technology', () => {
    const pythonIssue: Partial<GitHubIssue> = {
      title: 'Optimize memory allocation in C core parser',
      commentsCount: 20,
      updatedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      labels: [{ id: 1, name: 'architecture', color: 'ff0000' }],
      repository: {
        owner: 'python',
        name: 'cpython',
        fullName: 'python/cpython',
        language: 'C',
      },
    };

    const result = calculateMatchScore(sampleUser, pythonIssue);

    expect(result.totalScore).toBeLessThan(60);
    expect(result.learningOpportunities).toContain('C');
  });

  it('should produce identical score for identical user and issue (deterministic property)', () => {
    const issue: Partial<GitHubIssue> = {
      title: 'Add docs for custom hook',
      labels: [{ id: 1, name: 'documentation', color: '00ff00' }],
      repository: {
        owner: 'facebook',
        name: 'react',
        fullName: 'facebook/react',
        language: 'JavaScript',
      },
    };

    const run1 = calculateMatchScore(sampleUser, issue);
    const run2 = calculateMatchScore(sampleUser, issue);

    expect(run1.totalScore).toEqual(run2.totalScore);
    expect(run1.reasons).toEqual(run2.reasons);
  });
});
