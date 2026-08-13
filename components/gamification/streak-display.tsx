'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { calculateStreakBonus } from '@/lib/gamification/calculations';
import { Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StreakDisplayProps {
  streak: number;
  onClick?: () => void;
}

export function StreakDisplay({ streak, onClick }: StreakDisplayProps) {
  const emoji = null;
  const bonus = calculateStreakBonus(streak);
  const hasBonus = bonus > 1.0;

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 0] }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30 relative overflow-hidden">
        {/* Animated background pulse */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <div className="relative z-10 flex items-center gap-3">
          <motion.div className="text-2xl text-primary">
            <Trophy className="w-8 h-8" />
          </motion.div>
          
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {streak} Day{streak !== 1 ? 's' : ''}
            </div>
            <div className="text-xs text-muted-foreground">
              {hasBonus ? (
                  <span className="text-orange-400 font-semibold">
                  +{Math.round((bonus - 1) * 100)}% XP Bonus
                </span>
              ) : (
                'Keep your streak alive!'
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
