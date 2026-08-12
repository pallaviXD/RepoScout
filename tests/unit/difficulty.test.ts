import { describe, it, expect } from 'vitest';
import { calculateIssueDifficulty } from '../../lib/recommendation/difficulty';

describe('Deterministic Difficulty Engine', () => {
  it('should rank good first issues with low comments as Beginner (1-2 stars)', () => {
    const issue = {
      title: 'Fix typo in README installation guide',
      commentsCount: 0,
      labels: [{ id: 1, name: 'good first issue', color: '22c55e' }, { id: 2, name: 'docs', color: '0000ff' }],
      body: 'Simple typo fix in doc line 12.',
    };

    const res = calculateIssueDifficulty(issue);
    expect(res.difficulty).toBe('Beginner');
    expect(res.rating).toBeLessThanOrEqual(2);
    expect(res.reasons).toContain('Has Good First Issue label');
  });

  it('should rank complex architectural issues with heavy comments as Advanced', () => {
    const issue = {
      title: 'Redesign core concurrency dispatcher loop',
      commentsCount: 35,
      labels: [{ id: 1, name: 'difficulty: hard', color: 'ff0000' }, { id: 2, name: 'core', color: 'ff0000' }],
      body: 'A'.repeat(4000),
    };

    const res = calculateIssueDifficulty(issue);
    expect(res.difficulty).toBe('Advanced');
    expect(res.rating).toBe(5);
  });
});
