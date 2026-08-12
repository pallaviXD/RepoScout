import { describe, it, expect } from 'vitest';
import { normalizeGitHubLabels } from '../../lib/github/normalize';

describe('GitHub Label Normalization Engine', () => {
  it('should normalize various good first issue label variants', () => {
    const rawLabels = ['good first issue', 'good-first-issue', 'good_first_issue', 'starter-bug', 'level:easy'];
    
    for (const label of rawLabels) {
      const result = normalizeGitHubLabels([label]);
      expect(result.isGoodFirstIssue).toBe(true);
      expect(result.estimatedDifficulty).toBe('Beginner');
    }
  });

  it('should normalize help wanted and documentation labels', () => {
    const result = normalizeGitHubLabels(['Help Wanted', 'type:docs', 'area:docs']);
    expect(result.isHelpWanted).toBe(true);
    expect(result.isDocumentation).toBe(true);
  });

  it('should classify advanced labels as Advanced difficulty', () => {
    const result = normalizeGitHubLabels(['difficulty: hard', 'core', 'architecture']);
    expect(result.estimatedDifficulty).toBe('Advanced');
  });
});
