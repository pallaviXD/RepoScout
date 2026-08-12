import React from 'react';
import { searchIssues } from '@/lib/github/issues';
import { getCurrentUser } from '@/lib/auth/options';
import { calculateMatchScore } from '@/lib/recommendation/matchScore';
import { IssueCard } from '@/components/issues/issue-card';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import { UserPreferences } from '@/lib/types';

interface PageProps {
  searchParams: {
    category?: 'Beginner' | 'Intermediate' | 'Advanced';
    language?: string;
  };
}

export const revalidate = 300; // Cache for 5 minutes

export default async function GoodFirstIssuesPage({ searchParams }: PageProps) {
  const selectedCategory = searchParams.category || 'Beginner';
  const language = searchParams.language || '';

  // Retrieve user session preferences if authenticated
  const user = await getCurrentUser();
  let userPref: UserPreferences | null = null;
  if (user) {
    userPref = {
      skills: user.skills.map((s) => s.skillName),
      experienceLevel: user.experienceLevel as any,
      interests: user.interests.map((i) => i.interestName),
      contributionTypes: user.preferences.map((p) => p.type as any),
    };
  }

  // Fetch Good First Issues with label normalization search
  const result = await searchIssues({
    isGoodFirstIssue: true,
    language: language || undefined,
    perPage: 12,
  });

  const normalizedLabels = [
    'good first issue',
    'good-first-issue',
    'starter',
    'beginner',
    'help wanted',
    'documentation',
    'hacktoberfest',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Beginner Contribution Hub
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Good First Issues</h1>
        <p className="text-sm text-secondary-foreground max-w-2xl">
          Start your open-source journey with curated, beginner-friendly issues from active repositories across GitHub.
        </p>
      </div>

      {/* Difficulty Explanation Banner */}
      <Card className="p-5 bg-card border-card-border space-y-3">
        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
          <HelpCircle className="w-4 h-4 text-primary" />
          <span>How RepoScout Estimates Difficulty</span>
        </div>
        <p className="text-xs text-secondary-foreground leading-relaxed">
          RepoScout normalizes raw label variations across thousands of GitHub repos (such as <code className="text-primary">good-first-issue</code>, <code className="text-primary font-mono">starter-bug</code>, <code className="text-primary font-mono">docs</code>) and factors in issue age, discussion volume, and task scope to calculate a reliable <strong className="text-foreground">RepoScout estimated difficulty</strong>.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {normalizedLabels.map((lbl) => (
            <Badge key={lbl} variant="outline" className="text-[11px] bg-muted/40 font-mono">
              label: &quot;{lbl}&quot;
            </Badge>
          ))}
        </div>
      </Card>

      {/* Category Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex gap-2">
          {(['Beginner', 'Intermediate', 'Advanced'] as const).map((cat) => (
            <a
              key={cat}
              href={`/good-first-issues?category=${cat}${language ? `&language=${language}` : ''}`}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-black font-extrabold shadow-glow-sm'
                  : 'bg-card text-muted-foreground border border-border hover:text-foreground'
              }`}
            >
              {cat}
            </a>
          ))}
        </div>

        <p className="text-xs text-muted-foreground font-mono">
          Showing normalized <span className="text-primary font-semibold">{selectedCategory}</span> issues
        </p>
      </div>

      {/* Issue Grid */}
      {result.issues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.issues.map((issue) => {
            const matchScore = userPref ? calculateMatchScore(userPref, issue) : null;
            return <IssueCard key={issue.id} issue={issue} matchResult={matchScore} />;
          })}
        </div>
      ) : (
        <div className="text-center py-16 space-y-3 bg-card border border-border rounded-xl">
          <h3 className="text-lg font-bold text-foreground">No Good First Issues loaded right now</h3>
          <p className="text-xs text-muted-foreground">Please try again in a few moments.</p>
        </div>
      )}

    </div>
  );
}
