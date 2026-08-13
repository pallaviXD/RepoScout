import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRepositoryDetails } from '@/lib/github/repositories';
import { getRepositoryContributors } from '@/lib/github/contributors';
import { searchIssues } from '@/lib/github/issues';
import { calculateMatchScore } from '@/lib/recommendation/matchScore';
import { LanguageBar } from '@/components/projects/language-bar';
import { IssueCard } from '@/components/issues/issue-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNumber, formatDate } from '@/lib/utils';
import { ContributionType } from '@/lib/types';
import { Star, GitFork, CircleDot, ExternalLink, GitCommit, Users, CheckCircle2, Sparkles } from 'lucide-react';

interface PageProps {
  params: {
    owner: string;
    repo: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, repo } = params;
  return {
    title: `${owner}/${repo} — RepoScout`,
    description: `Explore ${owner}/${repo} open-source repository on RepoScout, discover good first issues, languages breakdown, and contributors.`,
  };
}

export const revalidate = 1800; // Cache details for 30 minutes

export default async function RepositoryDetailsPage({ params }: PageProps) {
  const { owner, repo } = params;

  const [details, contributors, issuesResult] = await Promise.all([
    getRepositoryDetails(owner, repo),
    getRepositoryContributors(owner, repo),
    searchIssues({ repository: `${owner}/${repo}`, perPage: 6 }),
  ]);

  if (!details.repository) {
    if (details.error?.includes('not found')) {
      notFound();
    }
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Repository Unavailable</h1>
        <p className="text-sm text-secondary-foreground">{details.error || 'Unable to fetch repository details.'}</p>
        <a href="/explore"><Button variant="outline">Back to Explore</Button></a>
      </div>
    );
  }

  const { repository, languagesBreakdown, recentCommits } = details;

  // Deterministic match breakdown using DEMO user profile
  const demoUserPref = {
    skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Python'],
    experienceLevel: 'INTERMEDIATE' as const,
    interests: ['Developer Tools', 'Web Development', 'Open Source', 'AI'],
    contributionTypes: ['BUG_FIX', 'FEATURE'] as ContributionType[],
  };

  const matchResult = calculateMatchScore(demoUserPref, {
    repository: {
      owner,
      name: repo,
      fullName: `${owner}/${repo}`,
      language: repository.language || 'TypeScript',
    },
    labels: repository.hasGoodFirstIssues ? [{ id: 1, name: 'good first issue', color: '22c55e' }] : [],
    updatedAt: repository.updatedAt,
  });

  const finalMatchScore = Math.max(78, matchResult.totalScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <Card className="p-6 md:p-8 bg-card border-card-border shadow-glow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              {repository.owner.avatarUrl && (
                <img src={repository.owner.avatarUrl} alt={owner} className="w-8 h-8 rounded-full border border-border" />
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
                {owner} / <span className="text-primary">{repo}</span>
              </h1>
              <Badge variant="success" className="font-bold text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30 ml-2">
                {finalMatchScore}% MATCH
              </Badge>
            </div>
            <p className="text-sm text-secondary-foreground max-w-3xl leading-relaxed">
              {repository.description || 'No description provided.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a href={`/contributions?owner=${owner}&repo=${repo}`}>
              <Button variant="primary" size="md" className="bg-green-600 hover:bg-green-700">
                Start Contribution Workflow
              </Button>
            </a>
            <a href={repository.htmlUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="md" className="gap-2">
                <span>Open GitHub</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-sm">
          <div className="p-3 rounded-lg bg-background border border-border">
            <span className="text-xs text-muted-foreground block font-sans">Stars</span>
            <span className="text-lg font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
              <Star className="w-4 h-4 fill-amber-400/20" /> {formatNumber(repository.stars)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-background border border-border">
            <span className="text-xs text-muted-foreground block font-sans">Forks</span>
            <span className="text-lg font-bold text-foreground flex items-center gap-1.5 mt-0.5">
              <GitFork className="w-4 h-4 text-primary" /> {formatNumber(repository.forks)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-background border border-border">
            <span className="text-xs text-muted-foreground block font-sans">Open Issues</span>
            <span className="text-lg font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <CircleDot className="w-4 h-4" /> {repository.openIssuesCount}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-background border border-border">
            <span className="text-xs text-muted-foreground block font-sans">Last Updated</span>
            <span className="text-sm font-bold text-foreground block mt-1 font-sans">
              {formatDate(repository.updatedAt)}
            </span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Open Issues */}
        <div className="lg:col-span-2 space-y-6">

          {/* WHY THIS MATCHES YOU Section */}
          <Card className="p-6 bg-card border-card-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2 font-mono">
                <Sparkles className="w-4 h-4 text-amber-400" /> WHY THIS MATCHES YOU
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-400">{finalMatchScore}% Overall Fit</span>
            </div>

            {/* Score Component Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-background border border-border">
                <span className="text-muted-foreground block text-[10px] uppercase">Skill Match</span>
                <span className="text-sm font-bold text-foreground">{matchResult.skillMatch} / 35</span>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border">
                <span className="text-muted-foreground block text-[10px] uppercase">Experience Fit</span>
                <span className="text-sm font-bold text-foreground">{matchResult.experienceMatch} / 20</span>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border">
                <span className="text-muted-foreground block text-[10px] uppercase">Interest Alignment</span>
                <span className="text-sm font-bold text-foreground">{matchResult.interestMatch} / 15</span>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border">
                <span className="text-muted-foreground block text-[10px] uppercase">Difficulty Level</span>
                <span className="text-sm font-bold text-foreground">{matchResult.difficultyMatch} / 10</span>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border">
                <span className="text-muted-foreground block text-[10px] uppercase">Repo Activity</span>
                <span className="text-sm font-bold text-foreground">{matchResult.repositoryActivity} / 10</span>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border">
                <span className="text-muted-foreground block text-[10px] uppercase">Tech Stack</span>
                <span className="text-sm font-bold text-foreground">{matchResult.technologyMatch} / 10</span>
              </div>
            </div>

            {/* Match Reasons */}
            <div className="space-y-2 pt-2">
              {matchResult.reasons.map((r, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-foreground/90 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </Card>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CircleDot className="w-5 h-5 text-primary" /> Open Contribution Opportunities
            </h2>
            <a href={`/issues?repository=${owner}/${repo}`} className="text-xs text-primary font-mono font-semibold hover:underline">
              View all issues →
            </a>
          </div>

          {issuesResult.issues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issuesResult.issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground text-sm">
              No open issues currently indexed for this repository.
            </Card>
          )}
        </div>

        {/* Sidebar: Languages, Topics, Contributors */}
        <div className="space-y-6">
          
          {/* Languages */}
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Languages</h3>
            <LanguageBar languages={languagesBreakdown} />
          </Card>

          {/* Topics */}
          {repository.topics.length > 0 && (
            <Card className="p-5 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Topics</h3>
              <div className="flex flex-wrap gap-1.5">
                {repository.topics.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs bg-muted/40 font-mono">
                    #{t}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Contributors */}
          {contributors.length > 0 && (
            <Card className="p-5 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Top Contributors
              </h3>
              <div className="space-y-2">
                {contributors.map((c) => (
                  <a
                    key={c.login}
                    href={c.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/60 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <img src={c.avatarUrl} alt={c.login} className="w-6 h-6 rounded-full border border-border" />
                      <span className="font-semibold text-foreground font-mono">{c.login}</span>
                    </div>
                    <span className="text-muted-foreground font-mono">{c.contributions} commits</span>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Recent Commits */}
          {recentCommits.length > 0 && (
            <Card className="p-5 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-primary" /> Recent Commits
              </h3>
              <div className="space-y-2.5">
                {recentCommits.map((commit, idx) => (
                  <div key={idx} className="text-xs border-b border-border/50 pb-2 last:border-none">
                    <p className="font-mono text-primary font-semibold text-[11px]">{commit.sha}</p>
                    <p className="text-secondary-foreground line-clamp-1 mt-0.5">{commit.message}</p>
                    <span className="text-[10px] text-muted-foreground block mt-1">
                      by {commit.author} • {formatDate(commit.date)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
}
