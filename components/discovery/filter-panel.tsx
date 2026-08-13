'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  totalRepositories: number;
  activeFilters: {
    languages: string[];
    experience: string | null;
    contributionTypes: string[];
    topics: string[];
    activity: string | null;
    difficulty: string | null;
  };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  totalRepositories,
  activeFilters,
  onFilterChange,
  onReset,
}) => {
  const languages = ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java'];
  const experiences = ['Beginner', 'Intermediate', 'Advanced'];
  const activities = ['Highly Active', 'Active', 'Moderate'];
  const difficulties = ['Beginner-friendly', 'Intermediate', 'Advanced'];

  const toggleArrayFilter = (key: keyof typeof activeFilters, value: string) => {
    const current = activeFilters[key] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFilterChange({ ...activeFilters, [key]: updated });
  };

  const toggleSingleFilter = (key: keyof typeof activeFilters, value: string) => {
    const current = activeFilters[key];
    onFilterChange({
      ...activeFilters,
      [key]: current === value ? null : value,
    });
  };

  const hasActiveFilters = 
    activeFilters.languages.length > 0 ||
    activeFilters.experience !== null ||
    activeFilters.activity !== null ||
    activeFilters.difficulty !== null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card border border-border rounded-xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 text-xs gap-1"
          >
            <X className="w-3 h-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {totalRepositories} repositories found
      </div>

      {/* Languages */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => toggleArrayFilter('languages', lang)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                activeFilters.languages.includes(lang)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Experience Level</h3>
        <div className="flex flex-col gap-2">
          {experiences.map(exp => (
            <label key={exp} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                checked={activeFilters.experience === exp}
                onChange={() => toggleSingleFilter('experience', exp)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground">
                {exp}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Activity Level */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Activity Level</h3>
        <div className="flex flex-col gap-2">
          {activities.map(activity => (
            <label key={activity} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                checked={activeFilters.activity === activity}
                onChange={() => toggleSingleFilter('activity', activity)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground">
                {activity}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Difficulty</h3>
        <div className="flex flex-col gap-2">
          {difficulties.map(difficulty => (
            <label key={difficulty} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                checked={activeFilters.difficulty === difficulty}
                onChange={() => toggleSingleFilter('difficulty', difficulty)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground">
                {difficulty}
              </span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
