'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { GitPullRequest, CheckCircle, GitFork, Star, Trophy } from 'lucide-react';
import { LiveActivity } from '@/lib/gamification/types';
import { generateRandomActivity } from '@/lib/gamification/mockGameData';

interface LiveFeedProps {
  initialActivities: LiveActivity[];
  maxItems?: number;
}

const actionConfig = {
  opened_pr: { icon: GitPullRequest, color: 'text-blue-400', label: 'opened a PR in' },
  closed_issue: { icon: CheckCircle, color: 'text-green-400', label: 'closed an issue in' },
  forked_repo: { icon: GitFork, color: 'text-purple-400', label: 'forked' },
  starred_repo: { icon: Star, color: 'text-amber-400', label: 'starred' },
  completed_quest: { icon: Trophy, color: 'text-orange-400', label: 'completed quest:' },
};

export function LiveFeed({ initialActivities, maxItems = 5 }: LiveFeedProps) {
  const [activities, setActivities] = useState<LiveActivity[]>(initialActivities);

  useEffect(() => {
    // Add random activity every 8-15 seconds
    const interval = setInterval(() => {
      const newActivity = generateRandomActivity();
      setActivities(prev => [newActivity, ...prev].slice(0, maxItems));
    }, Math.random() * 7000 + 8000); // 8-15 seconds

    return () => clearInterval(interval);
  }, [maxItems]);

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card className="p-4 bg-card border-card-border space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-green-400"
          />
          Live Activity
        </h3>
        <span className="text-xs text-muted-foreground font-mono">
          {activities.length} recent
        </span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => {
            const config = actionConfig[activity.action];
            const Icon = config.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <img
                    src={activity.avatar}
                    alt={activity.username}
                    className="w-8 h-8 rounded-full border-2 border-border"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-foreground truncate">
                        {activity.username}
                      </span>
                      <Icon className={`w-3 h-3 ${config.color} shrink-0`} />
                      <span className="text-muted-foreground">{config.label}</span>
                    </div>
                    <div className="text-xs font-mono text-primary truncate">
                      {activity.repoName}
                    </div>
                    {activity.xpGained && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] text-amber-400 font-semibold"
                      >
                        +{activity.xpGained} XP
                      </motion.div>
                    )}
                  </div>

                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {getTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
}
