'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { xpProgress, calculateLevel } from '@/lib/gamification/calculations';

interface XPBarProps {
  currentXP: number;
  showLabel?: boolean;
  animated?: boolean;
}

export function XPBar({ currentXP, showLabel = true, animated = true }: XPBarProps) {
  const { current, needed, percentage } = xpProgress(currentXP);
  const level = calculateLevel(currentXP);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">Level {level}</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </div>
          <span className="text-muted-foreground font-mono">
            {current.toLocaleString()} / {needed.toLocaleString()} XP
          </span>
        </div>
      )}
      
      <div className="relative h-3 bg-muted rounded-full overflow-hidden border border-border">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-purple-500 to-amber-400"
          initial={{ width: animated && !mounted ? 0 : `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
        
        {/* Sparkle effect */}
        {percentage > 0 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'easeInOut',
              repeatDelay: 1 
            }}
          />
        )}
      </div>
      
      <div className="text-center">
        <span className="text-[10px] text-muted-foreground font-mono">
          {percentage}% to Level {level + 1}
        </span>
      </div>
    </div>
  );
}
