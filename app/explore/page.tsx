export const dynamic = 'force-dynamic';

import React from 'react';
import ExploreClient from './explore-client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, AlertTriangle, Compass, TrendingUp } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/options';
import { UserPreferences } from '@/lib/types';

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

  // Demo-first: use local demo user and client-side demo dataset
  const user = await getCurrentUser();
  const userPref: UserPreferences = {
    skills: user?.skills.map((s: any) => s.skillName) || [],
    experienceLevel: (user?.experienceLevel as any) || 'INTERMEDIATE',
    interests: user?.interests.map((i: any) => i.interestName) || [],
    contributionTypes: user?.preferences.map((p: any) => p.type) || [],
  };

  const languagesList = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'PHP'];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-border">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <Compass className="w-8 h-8 text-primary" /> Explore Repositories
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
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

      {/* Repository Grid Workspace (client) */}
      <ExploreClient
        userPref={userPref}
        query={query}
        language={language}
        minStars={minStars}
        goodFirstIssues={goodFirstIssuesOnly}
        activeOnly={activeOnly}
        sort={sort}
      />

      </div>
    </div>
  );
}
