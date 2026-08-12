import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/options';
import { searchIssues } from '@/lib/github/issues';
import { calculateMatchScore } from '@/lib/recommendation/matchScore';
import { RecommendationCard } from '@/components/recommendation/recommendation-card';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPreferences } from '@/lib/types';
import { Sparkles, Bookmark, GitPullRequest, Settings, Code, UserCheck, ExternalLink, Compass } from 'lucide-react';

export const revalidate = 60; // Cache dashboard feed for 1 minute

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">Welcome to Your Developer Dashboard</h1>
        <p className="text-sm text-secondary-foreground max-w-md mx-auto">
          Sign in with GitHub or set up your skills to unlock personalized open-source issue recommendations and saved bookmarks.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <a href="/api/auth/signin">
            <Button variant="primary" size="lg">Sign in with GitHub</Button>
          </a>
          <Link href="/onboarding">
            <Button variant="outline" size="lg">Set Skills & Preferences</Button>
          </Link>
        </div>
      </div>
    );
  }

  const userPref: UserPreferences = {
    skills: user.skills.map((s) => s.skillName),
    experienceLevel: user.experienceLevel as any,
    interests: user.interests.map((i) => i.interestName),
    contributionTypes: user.preferences.map((p) => p.type as any),
  };

  // Fetch real GitHub open issues matching user skills
  const firstSkill = userPref.skills[0] || 'TypeScript';
  const issueResult = await searchIssues({
    query: firstSkill,
    isGoodFirstIssue: true,
    perPage: 12,
  });

  // Calculate & rank recommendations deterministically
  const rankedRecommendations = issueResult.issues
    .map((issue) => ({
      issue,
      matchResult: calculateMatchScore(userPref, issue),
    }))
    .sort((a, b) => b.matchResult.totalScore - a.matchResult.totalScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Welcome back, <span className="text-primary">{user.name || user.username}</span> 👋
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Your personalized open-source contribution journey & recommendation feed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/onboarding">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Settings className="w-3.5 h-3.5" /> Edit Profile Skills
            </Button>
          </Link>
          <Link href="/dashboard/saved">
            <Button variant="primary" size="sm" className="gap-2 text-xs">
              <Bookmark className="w-3.5 h-3.5" /> Saved Bookmarks
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-card-border space-y-1">
          <span className="text-xs text-muted-foreground font-medium block">Saved Repositories</span>
          <span className="text-2xl font-bold font-mono text-foreground">{user.savedRepos.length}</span>
        </Card>
        <Card className="p-4 bg-card border-card-border space-y-1">
          <span className="text-xs text-muted-foreground font-medium block">Saved Issues</span>
          <span className="text-2xl font-bold font-mono text-primary">{user.savedIssues.length}</span>
        </Card>
        <Card className="p-4 bg-card border-card-border space-y-1">
          <span className="text-xs text-muted-foreground font-medium block">Contributions Tracked</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{user.contributions.length}</span>
        </Card>
        <Card className="p-4 bg-card border-card-border space-y-1">
          <span className="text-xs text-muted-foreground font-medium block">Experience Level</span>
          <span className="text-sm font-bold font-mono text-foreground uppercase mt-1 block">
            {user.experienceLevel}
          </span>
        </Card>
      </div>

      {/* User Preferences Summary Pill Bar */}
      <Card className="p-5 bg-card border-card-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Match Criteria:
          </span>
          <Link href="/onboarding" className="text-xs text-primary font-mono hover:underline">
            Update →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {userPref.skills.map((s) => (
            <Badge key={s} variant="primary" className="text-xs font-mono">
              Skill: {s}
            </Badge>
          ))}
          {userPref.interests.map((i) => (
            <Badge key={i} variant="outline" className="text-xs bg-muted/40">
              Interest: {i}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Recommended Issues Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Recommended Contributions
            </h2>
            <p className="text-xs text-muted-foreground">
              Sorted using deterministic 100% skill match scoring.
            </p>
          </div>
          <Link href="/issues" className="text-xs text-primary font-mono font-semibold hover:underline">
            Browse all issues →
          </Link>
        </div>

        {rankedRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rankedRecommendations.map(({ issue, matchResult }) => (
              <RecommendationCard key={issue.id} issue={issue} matchResult={matchResult} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-muted-foreground text-sm">
            No recommendations loaded right now.
          </Card>
        )}
      </div>

    </div>
  );
}
