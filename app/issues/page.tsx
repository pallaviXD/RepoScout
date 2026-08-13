import React from 'react';
import { searchIssues } from '@/lib/github/issues';
import { getCurrentUser } from '@/lib/auth/options';
import { calculateMatchScore } from '@/lib/recommendation/matchScore';
import { IssueCard } from '@/components/issues/issue-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, AlertTriangle, Bug } from 'lucide-react';
import { UserPreferences } from '@/lib/types';

interface PageProps {
  searchParams: {
    query?: string;
    language?: string;
    repository?: string;
    label?: string;
    goodFirstIssue?: string;
    helpWanted?: string;
    docs?: string;
    sort?: 'updated' | 'created' | 'comments';
    page?: string;
  };
}

export const revalidate = 300; // Cache issue search for 5 minutes

export default async function IssuesPage({ searchParams }: PageProps) {
  const query = searchParams.query || '';
  const language = searchParams.language || '';
  const repository = searchParams.repository || '';
  const label = searchParams.label || '';
  const isGoodFirstIssue = searchParams.goodFirstIssue === 'true';
  const isHelpWanted = searchParams.helpWanted === 'true';
  const isDocumentation = searchParams.docs === 'true';
  const sort = searchParams.sort || 'updated';
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

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

  const result = await searchIssues({
    query,
    language: language || undefined,
    repository: repository || undefined,
    label: label || undefined,
    isGoodFirstIssue,
    isHelpWanted,
    isDocumentation,
    sort,
    page,
    perPage: 12,
  });

  const languagesList = ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C++'];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-border">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <Bug className="w-8 h-8 text-primary" /> Issue Explorer
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
            Find actionable open GitHub issues across top repositories.
            {userPref && <span className="text-primary font-semibold"> Matches sorted using your developer profile.</span>}
          </p>
        </div>

      {/* Filter Form */}
      <form method="GET" action="/issues" className="space-y-4 bg-card border border-card-border p-4 rounded-xl">
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            name="query"
            defaultValue={query}
            placeholder="Search issues by keywords (e.g. fix bug, accessibility, memory leak)..."
            icon={<Search className="w-4 h-4" />}
            className="flex-1"
          />
          <Button type="submit" variant="primary" className="shrink-0 px-6">
            Search Issues
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-border">
          {/* Language filter */}
          <select
            name="language"
            defaultValue={language}
            className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Languages</option>
            {languagesList.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {/* Repo filter */}
          <input
            type="text"
            name="repository"
            defaultValue={repository}
            placeholder="owner/repo (e.g. vercel/next.js)"
            className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />

          {/* Toggles */}
          <label className="inline-flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              name="goodFirstIssue"
              value="true"
              defaultChecked={isGoodFirstIssue}
              className="rounded accent-primary"
            />
            <span>Good First Issue</span>
          </label>

          <label className="inline-flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              name="helpWanted"
              value="true"
              defaultChecked={isHelpWanted}
              className="rounded accent-primary"
            />
            <span>Help Wanted</span>
          </label>

          <label className="inline-flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              name="docs"
              value="true"
              defaultChecked={isDocumentation}
              className="rounded accent-primary"
            />
            <span>Documentation</span>
          </label>
        </div>
      </form>

      {/* API Rate limit / error banner */}
      {result.error && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold">{result.isRateLimited ? 'GitHub Rate Limit Reached' : 'API Response Issue'}</p>
            <p className="text-xs text-amber-400/80">{result.error}</p>
          </div>
        </div>
      )}

      {/* Issue Card Grid */}
      {result.issues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.issues.map((issue) => {
            const matchScore = userPref ? calculateMatchScore(userPref, issue) : null;
            return <IssueCard key={issue.id} issue={issue} matchResult={matchScore} />;
          })}
        </div>
      ) : (
        !result.error && (
          <div className="text-center py-16 space-y-3 bg-card border border-border rounded-xl">
            <Bug className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-bold text-foreground">No matching issues found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try broadening your search query or unchecking strict label filters.
            </p>
          </div>
        )
      )}

      {/* Pagination */}
      {result.totalCount > 12 && (
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground font-mono">
            Showing page {page} of {Math.ceil(Math.min(result.totalCount, 1000) / 12)}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <a href={`/issues?query=${encodeURIComponent(query)}&page=${page - 1}`}>
                <Button variant="outline" size="sm">Previous Page</Button>
              </a>
            )}
            {page * 12 < result.totalCount && (
              <a href={`/issues?query=${encodeURIComponent(query)}&page=${page + 1}`}>
                <Button variant="primary" size="sm">Next Page</Button>
              </a>
            )}
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
