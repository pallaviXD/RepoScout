import React, { Suspense } from 'react';
import { searchRepositories } from '@/lib/github/repositories';
import { RepositoryCard } from '@/components/projects/repository-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, AlertTriangle, Compass } from 'lucide-react';

interface PageProps {
  searchParams: {
    query?: string;
    language?: string;
    minStars?: string;
    minForks?: string;
    topic?: string;
    goodFirstIssues?: string;
    activeOnly?: string;
    sort?: 'stars' | 'updated' | 'forks' | 'best-match';
    page?: string;
  };
}

export const revalidate = 600; // Cache search responses for 10 minutes

export default async function ExplorePage({ searchParams }: PageProps) {
  const query = searchParams.query || '';
  const language = searchParams.language || '';
  const minStars = searchParams.minStars ? parseInt(searchParams.minStars, 10) : undefined;
  const minForks = searchParams.minForks ? parseInt(searchParams.minForks, 10) : undefined;
  const topic = searchParams.topic || '';
  const goodFirstIssuesOnly = searchParams.goodFirstIssues === 'true';
  const activeOnly = searchParams.activeOnly === 'true';
  const sort = searchParams.sort || 'best-match';
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const result = await searchRepositories({
    query,
    language: language || undefined,
    minStars,
    minForks,
    topic: topic || undefined,
    goodFirstIssuesOnly,
    activeOnly,
    sort,
    page,
    perPage: 12,
  });

  const languagesList = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'PHP'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Explore Repositories</h1>
        <p className="text-sm text-secondary-foreground mt-1">
          Discover open-source repositories matching your preferred stack, language, and contribution criteria.
        </p>
      </div>

      {/* Search & Filters Controls */}
      <form method="GET" action="/explore" className="space-y-4 bg-card border border-card-border p-4 rounded-xl">
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            name="query"
            defaultValue={query}
            placeholder="Search repositories by name, keyword, or domain..."
            icon={<Search className="w-4 h-4" />}
            className="flex-1"
          />
          <Button type="submit" variant="primary" className="shrink-0 px-6">
            Search Repositories
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

          {/* Stars filter */}
          <select
            name="minStars"
            defaultValue={searchParams.minStars || ''}
            className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Any Stars</option>
            <option value="100">100+ Stars</option>
            <option value="1000">1,000+ Stars</option>
            <option value="5000">5,000+ Stars</option>
            <option value="10000">10,000+ Stars</option>
          </select>

          {/* Sort filter */}
          <select
            name="sort"
            defaultValue={sort}
            className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="best-match">Best Match</option>
            <option value="stars">Most Stars</option>
            <option value="updated">Recently Updated</option>
            <option value="forks">Most Forks</option>
          </select>

          {/* Toggles */}
          <label className="inline-flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              name="goodFirstIssues"
              value="true"
              defaultChecked={goodFirstIssuesOnly}
              className="rounded accent-primary"
            />
            <span>Good First Issues</span>
          </label>

          <label className="inline-flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              name="activeOnly"
              value="true"
              defaultChecked={activeOnly}
              className="rounded accent-primary"
            />
            <span>Active Repos (Pushed recently)</span>
          </label>
        </div>
      </form>

      {/* Error or Rate Limit Banner */}
      {result.error && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold">{result.isRateLimited ? 'GitHub API Rate Limit' : 'Data Request Issue'}</p>
            <p className="text-xs text-amber-400/80">{result.error}</p>
          </div>
        </div>
      )}

      {/* Repository Grid */}
      {result.repositories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.repositories.map((repo) => (
            <RepositoryCard key={repo.id} repository={repo} />
          ))}
        </div>
      ) : (
        !result.error && (
          <div className="text-center py-16 space-y-3 bg-card border border-border rounded-xl">
            <Compass className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-bold text-foreground">No repositories found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search query, removing language constraints, or clearing filters.
            </p>
          </div>
        )
      )}

      {/* Pagination controls */}
      {result.totalCount > 12 && (
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground font-mono">
            Showing page {page} of {Math.ceil(Math.min(result.totalCount, 1000) / 12)}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <a href={`/explore?query=${encodeURIComponent(query)}&page=${page - 1}&sort=${sort}&language=${language}`}>
                <Button variant="outline" size="sm">Previous Page</Button>
              </a>
            )}
            {page * 12 < result.totalCount && (
              <a href={`/explore?query=${encodeURIComponent(query)}&page=${page + 1}&sort=${sort}&language=${language}`}>
                <Button variant="primary" size="sm">Next Page</Button>
              </a>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
