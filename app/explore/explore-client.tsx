'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_REPOSITORIES } from '@/lib/github/mockData';
import { calculateMatchScore } from '@/lib/recommendation/matchScore';
import { RepositoryCard } from '@/components/projects/repository-card';
import { GitHubRepository, UserPreferences } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

interface Props {
  userPref: UserPreferences;
  query?: string;
  language?: string;
  minStars?: number;
  goodFirstIssues?: boolean;
  activeOnly?: boolean;
  sort?: string;
}

export default function ExploreClient({
  userPref,
  query = '',
  language = '',
  minStars,
  goodFirstIssues = false,
  activeOnly = false,
  sort = 'best-match',
}: Props) {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [savedRepoIds, setSavedRepoIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('reposcout_saved_repos') || '[]');
      setSavedRepoIds(new Set(saved));
    } catch (e) {}
  }, []);

  useEffect(() => {
    let list = [...MOCK_REPOSITORIES];

    // Query filter
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.owner.login.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          r.topics.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Language filter
    if (language) {
      list = list.filter((r) => r.language?.toLowerCase() === language.toLowerCase());
    }

    // Min stars
    if (minStars) {
      list = list.filter((r) => r.stars >= minStars);
    }

    // Good first issues
    if (goodFirstIssues) {
      list = list.filter((r) => r.hasGoodFirstIssues);
    }

    // Active only
    if (activeOnly) {
      list = list.filter((r) => r.isActive);
    }

    // Sorting
    if (sort === 'stars') {
      list.sort((a, b) => b.stars - a.stars);
    } else if (sort === 'updated') {
      list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (sort === 'forks') {
      list.sort((a, b) => b.forks - a.forks);
    } else {
      // Best match sorting using deterministic scoring
      list.sort((a, b) => {
        const scoreA = calculateMatchScore(userPref, {
          repository: { owner: a.owner.login, name: a.name, fullName: `${a.owner.login}/${a.name}`, language: a.language || '' },
          labels: a.hasGoodFirstIssues ? [{ id: 1, name: 'good first issue', color: '22c55e' }] : [],
        }).totalScore;
        const scoreB = calculateMatchScore(userPref, {
          repository: { owner: b.owner.login, name: b.name, fullName: `${b.owner.login}/${b.name}`, language: b.language || '' },
          labels: b.hasGoodFirstIssues ? [{ id: 1, name: 'good first issue', color: '22c55e' }] : [],
        }).totalScore;
        return scoreB - scoreA;
      });
    }

    setRepositories(list);
  }, [query, language, minStars, goodFirstIssues, activeOnly, sort, userPref]);

  const handleToggleSave = (repo: GitHubRepository) => {
    setSavedRepoIds((prev) => {
      const next = new Set(prev);
      if (next.has(repo.id)) {
        next.delete(repo.id);
      } else {
        next.add(repo.id);
      }
      try {
        localStorage.setItem('reposcout_saved_repos', JSON.stringify(Array.from(next)));
      } catch (e) {}
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Result Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-border pb-3">
        <span>Showing {repositories.length} open-source repositories</span>
        <span className="flex items-center gap-1.5 text-primary">
          <Sparkles className="w-3.5 h-3.5" /> Deterministic Skill-Ranked
        </span>
      </div>

      {/* Repository Grid */}
      {repositories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repository={repo}
              isSaved={savedRepoIds.has(repo.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      ) : (
        <Card className="p-16 text-center text-muted-foreground space-y-3 bg-card border-card-border">
          <p className="text-base font-bold text-foreground">No repositories found</p>
          <p className="text-xs">Try relaxing your search terms or filter constraints.</p>
        </Card>
      )}
    </div>
  );
}

