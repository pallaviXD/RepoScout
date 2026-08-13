'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles } from 'lucide-react';
import { Achievement } from '@/lib/gamification/types';

interface AchievementShowcaseProps {
  achievements: Achievement[];
}

const rarityColors = {
  common: 'border-gray-400 bg-gray-500/10',
  rare: 'border-blue-400 bg-blue-500/10',
  epic: 'border-purple-400 bg-purple-500/10',
  legendary: 'border-amber-400 bg-amber-500/10',
};

const rarityText = {
  common: 'text-gray-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-amber-400',
};

export function AchievementShowcase({ achievements }: AchievementShowcaseProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedAchievement = achievements.find(a => a.id === selectedId);

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Achievements
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            {unlockedCount} / {achievements.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {achievements.map((achievement, index) => {
            const isUnlocked = !!achievement.unlockedAt;
            const hasProgress = achievement.progress !== undefined;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => setSelectedId(achievement.id)}
                className="cursor-pointer"
              >
                <Card className={`p-4 text-center border-2 ${
                  isUnlocked 
                    ? rarityColors[achievement.rarity]
                    : 'border-muted bg-muted/20 opacity-60'
                }`}>
                  {/* Icon */}
                  <div className="text-xs font-mono font-bold my-2 relative flex items-center justify-center min-h-[36px]">
                    {isUnlocked ? (
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-2.5 py-1 rounded bg-muted/50 border border-border font-mono"
                      >
                        {achievement.icon}
                      </motion.div>
                    ) : (
                      <div className="relative flex items-center justify-center">
                        <div className="blur-xs opacity-40 px-2.5 py-1 rounded bg-muted font-mono">{achievement.icon}</div>
                        <Lock className="w-4 h-4 text-muted-foreground absolute inset-0 m-auto" />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div className={`text-xs font-semibold mb-1 ${
                    isUnlocked ? rarityText[achievement.rarity] : 'text-muted-foreground'
                  }`}>
                    {achievement.title}
                  </div>

                  {/* Progress bar if applicable */}
                  {hasProgress && !isUnlocked && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${(achievement.progress! / achievement.maxProgress!) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="text-[9px] text-muted-foreground mt-1 font-mono">
                        {achievement.progress} / {achievement.maxProgress}
                      </div>
                    </div>
                  )}

                  {/* Rarity badge */}
                  <Badge 
                    variant="outline" 
                    className={`text-[9px] mt-2 ${rarityText[achievement.rarity]} border-current`}
                  >
                    {achievement.rarity}
                  </Badge>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md p-6 rounded-xl border-2 ${
                selectedAchievement.unlockedAt
                  ? rarityColors[selectedAchievement.rarity]
                  : 'border-muted bg-muted/20'
              } bg-background`}
            >
              <div className="text-center space-y-4">
                <div className="text-sm font-mono font-bold px-3 py-1.5 rounded bg-muted/60 border border-border inline-block mx-auto">
                  {selectedAchievement.icon}
                </div>
                <h2 className={`text-2xl font-bold ${
                  selectedAchievement.unlockedAt
                    ? rarityText[selectedAchievement.rarity]
                    : 'text-muted-foreground'
                }`}>
                  {selectedAchievement.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedAchievement.description}
                </p>
                {selectedAchievement.unlockedAt && (
                  <div className="text-xs text-muted-foreground font-mono">
                    Unlocked {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
                <Badge 
                  variant="outline" 
                  className={`${rarityText[selectedAchievement.rarity]} border-current`}
                >
                  {selectedAchievement.rarity.toUpperCase()}
                </Badge>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
