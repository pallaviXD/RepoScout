import React from 'react';
import { getCurrentUser } from '@/lib/auth/options';
import { DashboardClient } from './dashboard-client';
import { UserPreferences } from '@/lib/types';
import { DEMO_REPOSITORIES } from '@/lib/demo/repositories';
import { calculateMatchScore } from '@/lib/recommendation/matchScore';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const userPref: UserPreferences = {
    skills: user?.skills.map((s) => s.skillName) || ['TypeScript', 'React', 'Next.js'],
    experienceLevel: (user?.experienceLevel as any) || 'INTERMEDIATE',
    interests: user?.interests.map((i) => i.interestName) || ['Web Development', 'Open Source'],
    contributionTypes: user?.preferences.map((p) => p.type as any) || ['BUG_FIX', 'FEATURE'],
  };

  // Generate demo recommendations from local dataset
  const rankedRecommendations = DEMO_REPOSITORIES.slice(0, 5).map((repo, idx) => {
    const fakeIssue = {
      id: repo.id,
      title: `Refactor module & update docs for ${repo.name}`,
      number: 100 + idx,
      htmlUrl: repo.htmlUrl,
      repository: { language: repo.language, name: repo.name, owner: repo.owner.login, fullName: repo.fullName },
      labels: repo.topics.concat(repo.hasGoodFirstIssues ? ['good-first-issue'] : []).map((name, i) => ({
        id: i + 1,
        name,
        color: '6d6d6d',
      })),
      updatedAt: repo.updatedAt,
      body: repo.description || '',
    };
    const matchResult = calculateMatchScore(userPref, fakeIssue);
    return { issue: fakeIssue, matchResult };
  });

  return <DashboardClient user={user} userPref={userPref} rankedRecommendations={rankedRecommendations} />;
}

