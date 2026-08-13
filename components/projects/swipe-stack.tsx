'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { DEMO_REPOSITORIES } from '@/lib/demo/repositories';
import { GitHubRepository, UserPreferences } from '@/lib/types';
import { calculateMatchScore } from '@/lib/recommendation/matchScore';
import { calculateIssueDifficulty } from '@/lib/recommendation/difficulty';
import { 
  X, 
  Bookmark, 
  ArrowRight, 
  ExternalLink, 
  Star, 
  GitFork, 
  AlertCircle,
  Check,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface Props {
  userPref: UserPreferences;
}

export function SwipeStack({ userPref }: Props) {
  const [filter, setFilter] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('ALL');
  const [repositories, setRepositories] = useState<GitHubRepository[]>(DEMO_REPOSITORIES);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [savedIds, setSavedIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('demo_saved') || '[]'); } catch { return []; }
  });

  const [interestedIds, setInterestedIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('demo_interested') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem('demo_saved', JSON.stringify(savedIds)); } catch {}
  }, [savedIds]);

  useEffect(() => {
    try { localStorage.setItem('demo_interested', JSON.stringify(interestedIds)); } catch {}
  }, [interestedIds]);

  // Filter repositories based on selected level pill
  const filteredRepos = repositories.filter((repo) => {
    if (filter === 'ALL') return true;
    const fakeIssue = { 
      repository: { language: repo.language, owner: repo.owner.login, name: repo.name, fullName: repo.fullName }, 
      labels: (repo.topics || []).map((name, i) => ({ id: i + 1, name, color: '6d6d6d' })), 
      body: repo.description || '' 
    };
    const diff = calculateIssueDifficulty(fakeIssue).difficulty.toUpperCase();
    if (filter === 'BEGINNER') return diff === 'BEGINNER';
    if (filter === 'INTERMEDIATE') return diff === 'INTERMEDIATE';
    if (filter === 'ADVANCED') return diff === 'ADVANCED';
    return true;
  });

  // Cycle repositories smoothly if index exceeds length
  const activeIndex = filteredRepos.length > 0 ? currentIndex % filteredRepos.length : 0;
  const currentRepo = filteredRepos[activeIndex];
  const nextRepo = filteredRepos.length > 1 ? filteredRepos[(activeIndex + 1) % filteredRepos.length] : null;
  const thirdRepo = filteredRepos.length > 2 ? filteredRepos[(activeIndex + 2) % filteredRepos.length] : null;

  const handleNext = (direction: 'left' | 'right') => {
    if (!currentRepo) return;
    if (direction === 'right') {
      setInterestedIds((prev) => Array.from(new Set([...prev, currentRepo.id])));
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const toggleSave = (repoId: number) => {
    setSavedIds((prev) => 
      prev.includes(repoId) ? prev.filter((id) => id !== repoId) : [...prev, repoId]
    );
  };

  const computeMatchDetails = (repo: GitHubRepository) => {
    const fakeIssue: any = {
      repository: { language: repo.language, name: repo.name, owner: repo.owner.login, fullName: repo.fullName },
      labels: (repo.topics || []).map((name, i) => ({ id: i + 1, name, color: '6d6d6d' })),
      updatedAt: repo.updatedAt,
      body: repo.description || '',
    };
    return calculateMatchScore(userPref, fakeIssue);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Filter Pills */}
      <div className="flex items-center justify-center gap-2 bg-muted/40 p-1.5 rounded-full border border-border">
        {(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((level) => (
          <button
            key={level}
            onClick={() => {
              setFilter(level);
              setCurrentIndex(0);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === level
                ? 'bg-foreground text-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {level === 'ALL' ? 'All Level' : level.charAt(0) + level.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Swipe Stack Canvas */}
      <div className="relative w-full max-w-2xl h-[520px] flex items-center justify-center">
        {currentRepo ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background Layer 3 */}
            {thirdRepo && (
              <div 
                className="absolute w-[92%] h-[460px] rounded-2xl bg-card border border-card-border p-6 opacity-40 shadow-sm pointer-events-none"
                style={{ transform: 'translateY(16px) scale(0.92)' }}
              />
            )}

            {/* Background Layer 2 */}
            {nextRepo && (
              <div 
                className="absolute w-[96%] h-[475px] rounded-2xl bg-card border border-card-border p-6 opacity-75 shadow-md pointer-events-none"
                style={{ transform: 'translateY(8px) scale(0.96)' }}
              />
            )}

            {/* Active Card Layer */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentRepo.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info: PanInfo) => {
                  if (info.offset.x > 100 || info.velocity.x > 500) {
                    handleNext('right');
                  } else if (info.offset.x < -100 || info.velocity.x < -500) {
                    handleNext('left');
                  }
                }}
                whileTap={{ cursor: 'grabbing' }}
                className="absolute w-full h-full rounded-2xl bg-card border border-card-border p-6 sm:p-8 shadow-xl flex flex-col justify-between cursor-grab select-none z-10"
              >
                {/* Card Top Header */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      {currentRepo.owner.avatarUrl ? (
                        <img 
                          src={currentRepo.owner.avatarUrl} 
                          alt={currentRepo.owner.login}
                          className="w-11 h-11 rounded-full border border-border" 
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
                          {currentRepo.owner.login[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-mono text-muted-foreground block">
                          {currentRepo.owner.login}
                        </span>
                        <h2 className="text-xl font-bold text-foreground tracking-tight">
                          {currentRepo.name}
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 font-mono text-xs font-bold">
                        {computeMatchDetails(currentRepo).totalScore}% MATCH
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-1 font-mono">
                        {currentRepo.language}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                    {currentRepo.description || 'No description available for this repository.'}
                  </p>

                  {/* Topics / Tech Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {currentRepo.topics.slice(0, 5).map((topic) => (
                      <span
                        key={topic}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border/50"
                      >
                        {topic}
                      </span>
                    ))}
                    {currentRepo.hasGoodFirstIssues && (
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                        Good First Issue
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Rationale & Stats */}
                <div className="border-t border-b border-border py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-primary" /> WHY THIS MATCHES
                    </span>
                    <div className="space-y-1">
                      {computeMatchDetails(currentRepo).reasons.slice(0, 3).map((reason, idx) => (
                        <p key={idx} className="text-xs text-foreground/90 leading-tight">
                          {reason}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-border pt-2 sm:pt-0 sm:pl-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      REPOSITORY METRICS
                    </span>
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="bg-muted/40 p-2 rounded-lg">
                        <Star className="w-3.5 h-3.5 mx-auto mb-1 text-amber-500" />
                        <span className="text-xs font-bold font-mono block">
                          {currentRepo.stars.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-muted-foreground block">Stars</span>
                      </div>
                      <div className="bg-muted/40 p-2 rounded-lg">
                        <GitFork className="w-3.5 h-3.5 mx-auto mb-1 text-blue-500" />
                        <span className="text-xs font-bold font-mono block">
                          {currentRepo.forks.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-muted-foreground block">Forks</span>
                      </div>
                      <div className="bg-muted/40 p-2 rounded-lg">
                        <AlertCircle className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-500" />
                        <span className="text-xs font-bold font-mono block">
                          {currentRepo.openIssuesCount}
                        </span>
                        <span className="text-[9px] text-muted-foreground block">Issues</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-4 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleNext('left')}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors"
                  >
                    <X className="w-4 h-4 text-rose-500" />
                    <span>Skip</span>
                  </button>

                  <button
                    onClick={() => toggleSave(currentRepo.id)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 transition-colors ${
                      savedIds.includes(currentRepo.id)
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-border bg-background hover:bg-muted text-foreground'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${savedIds.includes(currentRepo.id) ? 'fill-current' : ''}`} />
                    <span>{savedIds.includes(currentRepo.id) ? 'Saved' : 'Save'}</span>
                  </button>

                  <a
                    href={currentRepo.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="View on GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleNext('right')}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold transition-opacity shadow-md"
                  >
                    <span>Interested</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center p-8 border border-border rounded-2xl bg-card">
            <p className="text-sm text-muted-foreground">No repositories found for this filter.</p>
          </div>
        )}
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="flex items-center gap-6 text-xs text-muted-foreground font-mono">
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-0.5 rounded bg-muted border border-border text-[10px]">←</kbd> Drag left to Skip
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-0.5 rounded bg-muted border border-border text-[10px]">→</kbd> Drag right for Interested
        </span>
      </div>
    </div>
  );
}

