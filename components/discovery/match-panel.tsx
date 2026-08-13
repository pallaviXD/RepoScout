'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Activity, AlertCircle } from 'lucide-react';

interface MatchPanelProps {
  matchScore: number;
  skillsMatched: number;
  totalSkills: number;
  experienceLevel: string;
  interestsMatched: number;
  totalInterests: number;
  difficulty: string;
  activityLevel: string;
  reasons: string[];
}

export const MatchPanel: React.FC<MatchPanelProps> = ({
  matchScore,
  skillsMatched,
  totalSkills,
  experienceLevel,
  interestsMatched,
  totalInterests,
  difficulty,
  activityLevel,
  reasons,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-blue-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 75) return 'Great Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card border border-border rounded-xl p-6 space-y-6 sticky top-24"
    >
      {/* Match Score */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Match Score</h2>
        </div>
        <div className={`text-5xl font-bold ${getScoreColor(matchScore)}`}>
          {matchScore}%
        </div>
        <div className="text-sm text-muted-foreground">
          {getScoreLabel(matchScore)}
        </div>
      </div>

      {/* Match Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Match Breakdown</h3>
        
        {/* Skills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Skills Match</span>
            <span className="text-foreground font-medium">
              {skillsMatched}/{totalSkills}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(skillsMatched / totalSkills) * 100}%` }}
            />
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Interests Match</span>
            <span className="text-foreground font-medium">
              {interestsMatched}/{totalInterests}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(interestsMatched / totalInterests) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Experience Level
          </span>
          <span className="text-foreground font-medium">{experienceLevel}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Difficulty
          </span>
          <span className="text-foreground font-medium">{difficulty}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Activity
          </span>
          <span className="text-foreground font-medium">{activityLevel}</span>
        </div>
      </div>

      {/* Match Reasons */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="text-sm font-medium text-foreground">Why This Matches</h3>
        <ul className="space-y-2">
          {reasons.map((reason, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};
