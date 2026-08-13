'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Trophy, Coins } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DailyQuest } from '@/lib/gamification/types';

interface QuestCardProps {
  quest: DailyQuest;
  index: number;
}

export function QuestCard({ quest, index }: QuestCardProps) {
  const progressPercent = (quest.progress / quest.maxProgress) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, x: 5 }}
    >
      <Card className={`p-4 border-l-4 ${
        quest.completed 
          ? 'bg-green-500/5 border-l-green-500' 
          : 'bg-card border-l-primary'
      }`}>
        <div className="flex items-start gap-3">
          {/* Quest Icon */}
          <motion.div
            animate={quest.completed ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            {quest.completed ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground" />
            )}
          </motion.div>

          <div className="flex-1 space-y-2">
            {/* Title */}
            <div className="flex items-center justify-between">
              <h4 className={`font-semibold text-sm ${
                quest.completed ? 'text-muted-foreground line-through' : 'text-foreground'
              }`}>
                {quest.title}
              </h4>
              {quest.completed && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                </motion.div>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground">{quest.description}</p>

            {/* Progress Bar */}
            {!quest.completed && (
              <div className="space-y-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="font-mono">
                    {quest.progress} / {quest.maxProgress}
                  </span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
              </div>
            )}

            {/* Rewards */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-xs text-primary font-mono">
                <Trophy className="w-3 h-3" />
                <span>{quest.xpReward} XP</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                <Coins className="w-3 h-3" />
                <span>{quest.coinReward}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
