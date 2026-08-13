'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { GitHubRepository } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X, Heart, Eye, ArrowLeft, Star, GitFork, AlertCircle } from 'lucide-react';

interface RepositoryCardStackProps {
  repositories: GitHubRepository[];
  onSwipeLeft: (repo: GitHubRepository) => void;
  onSwipeRight: (repo: GitHubRepository) => void;
  onSave: (repo: GitHubRepository) => void;
  onViewProject: (repo: GitHubRepository) => void;
  matchScores: Record<number, number>;
  matchReasons: Record<number, string[]>;
}

export const RepositoryCardStack: React.FC<RepositoryCardStackProps> = ({
  repositories,
  onSwipeLeft,
  onSwipeRight,
  onSave,
  onViewProject,
  matchScores,
  matchReasons,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const currentRepo = repositories[currentIndex];
  const nextRepo = repositories[currentIndex + 1];
  const hasMore = currentIndex < repositories.length - 1;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleSkip();
      if (e.key === 'ArrowRight') handleInterested();
      if (e.key === 's' || e.key === 'S') currentRepo && onSave(currentRepo);
      if (e.key === 'e' || e.key === 'E') currentRepo && onViewProject(currentRepo);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, currentRepo]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!currentRepo) return;

    const threshold = 100;
    if (info.offset.x > threshold) {
      // Swiped right - interested
      setDirection('right');
      onSwipeRight(currentRepo);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setDirection(null);
        x.set(0);
      }, 300);
    } else if (info.offset.x < -threshold) {
      // Swiped left - skip
      setDirection('left');
      onSwipeLeft(currentRepo);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setDirection(null);
        x.set(0);
      }, 300);
    } else {
      // Return to center
      x.set(0);
    }
  };

  const handleSkip = () => {
    if (!currentRepo) return;
    setDirection('left');
    onSwipeLeft(currentRepo);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
      x.set(0);
    }, 300);
  };

  const handleInterested = () => {
    if (!currentRepo) return;
    setDirection('right');
    onSwipeRight(currentRepo);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
      x.set(0);
    }, 300);
  };

  if (!currentRepo) {
    return (
      <div className="flex items-center justify-center h-[680px] bg-card border border-border rounded-xl">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="text-lg font-semibold text-foreground">No more repositories</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            You&apos;ve reviewed all available repositories. Try adjusting your filters or come back later for more.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Card Stack Container */}
      <div className="relative h-[680px]">
        {/* Next Card (Background) */}
        {nextRepo && (
          <motion.div
            className="absolute inset-0 w-full"
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: 0.95, opacity: 0.5 }}
          >
            <div className="bg-card border border-border rounded-xl h-full p-8 blur-[2px]">
              <div className="space-y-4">
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Current Card (Foreground) */}
        <motion.div
          className="absolute inset-0 w-full cursor-grab active:cursor-grabbing"
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: 'grabbing' }}
        >
          <div className="bg-card border border-border rounded-xl h-full overflow-hidden">
            {/* Match Score Badge */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-semibold">
                {matchScores[currentRepo.id] || 85}% Match
              </div>
            </div>

            {/* Card Content */}
            <div className="p-8 h-full flex flex-col">
              {/* Header */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4">
                  {currentRepo.owner.avatarUrl && (
                    <img
                      src={currentRepo.owner.avatarUrl}
                      alt={currentRepo.owner.login}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-foreground mb-1 truncate">
                      {currentRepo.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {currentRepo.owner.login}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{currentRepo.stars.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    <span>{currentRepo.forks.toLocaleString()}</span>
                  </div>
                  {currentRepo.language && (
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {currentRepo.language}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="flex-1 overflow-y-auto mb-6">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {currentRepo.description || 'No description available'}
                </p>

                {/* Topics */}
                {currentRepo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentRepo.topics.slice(0, 8).map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {/* Match Reasons */}
                {matchReasons[currentRepo.id] && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground">Why this matches:</h3>
                    <ul className="space-y-1">
                      {matchReasons[currentRepo.id].slice(0, 4).map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSkip}
                  className="gap-2 text-red-500 border-red-500/30 hover:bg-red-500/10"
                >
                  <X className="w-5 h-5" />
                  Skip
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onSave(currentRepo)}
                  className="gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Save
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onViewProject(currentRepo)}
                  className="gap-2"
                >
                  <Eye className="w-5 h-5" />
                  View
                </Button>

                <Button
                  size="lg"
                  onClick={handleInterested}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                  Interested
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {currentIndex + 1} of {repositories.length} repositories
        </p>
        <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden max-w-md mx-auto">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / repositories.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Keyboard Hints */}
      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span>← Skip</span>
        <span>S Save</span>
        <span>E View</span>
        <span>→ Interested</span>
      </div>
    </div>
  );
};
