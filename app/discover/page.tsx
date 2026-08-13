'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RepositoryCardStack } from '@/components/discovery/repository-card-stack';
import { MatchPanel } from '@/components/discovery/match-panel';
import { FilterPanel } from '@/components/discovery/filter-panel';
import { MOCK_REPOSITORIES } from '@/lib/github/mockData';
import { GitHubRepository } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function DiscoverPage() {
  const router = useRouter();
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepository[]>([]);
  const [currentRepo, setCurrentRepo] = useState<GitHubRepository | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'stars' | 'updated' | 'active'>('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [savedRepos, setSavedRepos] = useState<Set<number>>(new Set());
  const [interestedRepos, setInterestedRepos] = useState<Set<number>>(new Set());
  const [skippedRepos, setSkippedRepos] = useState<Set<number>>(new Set());
  
  const [filters, setFilters] = useState({
    languages: [] as string[],
    experience: null as string | null,
    contributionTypes: [] as string[],
    topics: [] as string[],
    activity: null as string | null,
    difficulty: null as string | null,
  });

  useEffect(() => {
    // Initialize with mock data
    let repos = [...MOCK_REPOSITORIES];
    
    // Apply filters
    if (filters.languages.length > 0) {
      repos = repos.filter(repo => 
        repo.language && filters.languages.includes(repo.language)
      );
    }

    if (filters.activity === 'Highly Active') {
      repos = repos.filter(repo => {
        const hoursSinceUpdate = (Date.now() - new Date(repo.updatedAt).getTime()) / (1000 * 60 * 60);
        return hoursSinceUpdate < 24;
      });
    } else if (filters.activity === 'Active') {
      repos = repos.filter(repo => {
        const hoursSinceUpdate = (Date.now() - new Date(repo.updatedAt).getTime()) / (1000 * 60 * 60);
        return hoursSinceUpdate < 168; // 1 week
      });
    }

    // Apply search
    if (searchQuery) {
      repos = repos.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    if (sortBy === 'stars') {
      repos.sort((a, b) => b.stars - a.stars);
    } else if (sortBy === 'updated') {
      repos.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } else if (sortBy === 'active') {
      repos.sort((a, b) => b.openIssuesCount - a.openIssuesCount);
    }

    // Remove skipped repos from current session
    repos = repos.filter(repo => !skippedRepos.has(repo.id));

    setFilteredRepos(repos);
    if (repos.length > 0 && !currentRepo) {
      setCurrentRepo(repos[0]);
    }
  }, [filters, searchQuery, sortBy, skippedRepos]);

  useEffect(() => {
    if (filteredRepos.length > 0) {
      setCurrentRepo(filteredRepos[0]);
    }
  }, [filteredRepos]);

  // Generate mock match scores and reasons
  const getMatchData = (repo: GitHubRepository) => {
    const score = Math.floor(Math.random() * 30) + 70; // 70-100
    const reasons = [
      `${repo.language || 'Technology'} matches your skills`,
      `${repo.stars > 10000 ? 'Popular' : 'Active'} repository with strong community`,
      `${repo.hasGoodFirstIssues ? 'Has good first issues' : 'Well-maintained codebase'}`,
      `Recent activity (updated ${getTimeAgo(repo.updatedAt)})`,
    ];

    return { score, reasons };
  };

  const getMatchReasons = (repo: GitHubRepository) => {
    const reasons: string[] = [];
    if (repo.language) reasons.push(`${repo.language} skill`);
    if (repo.hasGoodFirstIssues) reasons.push('Beginner-friendly');
    if (repo.stars > 10000) reasons.push('Popular project');
    if (repo.topics.length > 0) reasons.push(repo.topics[0]);
    return reasons;
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleSwipeLeft = (repo: GitHubRepository) => {
    setSkippedRepos(prev => new Set([...prev, repo.id]));
  };

  const handleSwipeRight = (repo: GitHubRepository) => {
    setInterestedRepos(prev => new Set([...prev, repo.id]));
    console.log('Added to interested:', repo.name);
  };

  const handleSave = (repo: GitHubRepository) => {
    setSavedRepos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(repo.id)) {
        newSet.delete(repo.id);
      } else {
        newSet.add(repo.id);
      }
      return newSet;
    });
  };

  const handleViewProject = (repo: GitHubRepository) => {
    router.push(`/projects/${repo.owner.login}/${repo.name}`);
  };

  const handleResetFilters = () => {
    setFilters({
      languages: [],
      experience: null,
      contributionTypes: [],
      topics: [],
      activity: null,
      difficulty: null,
    });
    setSearchQuery('');
    setSortBy('recommended');
  };

  const matchScores: Record<number, number> = {};
  const matchReasons: Record<number, string[]> = {};
  
  filteredRepos.forEach(repo => {
    const { score, reasons } = getMatchData(repo);
    matchScores[repo.id] = score;
    matchReasons[repo.id] = getMatchReasons(repo);
  });

  const currentMatchData = currentRepo ? getMatchData(currentRepo) : null;

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Discover Projects
          </h1>
          <p className="text-muted-foreground">
            Find open-source repositories that match your skills and interests
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repositories..."
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="recommended">Recommended</option>
            <option value="stars">Most Stars</option>
            <option value="updated">Recently Updated</option>
            <option value="active">Most Active</option>
          </select>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Filters */}
          <div className="lg:col-span-3">
            <FilterPanel
              totalRepositories={filteredRepos.length}
              activeFilters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Center - Card Stack */}
          <div className="lg:col-span-6">
            <RepositoryCardStack
              repositories={filteredRepos}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onSave={handleSave}
              onViewProject={handleViewProject}
              matchScores={matchScores}
              matchReasons={matchReasons}
            />
          </div>

          {/* Right Panel - Match Info */}
          <div className="lg:col-span-3">
            {currentRepo && currentMatchData && (
              <MatchPanel
                matchScore={currentMatchData.score}
                skillsMatched={4}
                totalSkills={5}
                experienceLevel="Intermediate"
                interestsMatched={3}
                totalInterests={4}
                difficulty={currentRepo.hasGoodFirstIssues ? 'Beginner-friendly' : 'Intermediate'}
                activityLevel={currentRepo.isActive ? 'Highly Active' : 'Active'}
                reasons={currentMatchData.reasons}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
