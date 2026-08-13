'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface ContributionHeatmapProps {
  contributions: { day: string; count: number }[];
}

export function ContributionHeatmap({ contributions }: ContributionHeatmapProps) {
  const maxCount = Math.max(...contributions.map(c => c.count), 1);
  
  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-muted';
    const intensity = Math.ceil((count / maxCount) * 4);
    const colors = [
      'bg-green-200',
      'bg-green-400',
      'bg-green-600',
      'bg-green-800',
    ];
    return colors[Math.min(intensity - 1, 3)];
  };

  // Group by weeks (7 days)
  const weeks = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-card border-card-border">
        <h3 className="text-lg font-bold text-foreground mb-4">Contribution Calendar</h3>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: (weekIndex * 7 + dayIndex) * 0.01 
                  }}
                  whileHover={{ scale: 1.3, zIndex: 10 }}
                  className={`w-3 h-3 rounded-sm ${getIntensity(day.count)} cursor-pointer`}
                  title={`${day.day}: ${day.count} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-green-200" />
            <div className="w-3 h-3 rounded-sm bg-green-400" />
            <div className="w-3 h-3 rounded-sm bg-green-600" />
            <div className="w-3 h-3 rounded-sm bg-green-800" />
          </div>
          <span>More</span>
        </div>
      </Card>
    </motion.div>
  );
}
