'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AnimatedStatProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay?: number;
}

export function AnimatedStat({ 
  label, 
  value, 
  icon: Icon, 
  color = 'text-primary',
  prefix = '',
  suffix = '',
  decimals = 0,
  delay = 0 
}: AnimatedStatProps) {
  const [mounted, setMounted] = useState(false);
  const spring = useSpring(0, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (current) => 
    prefix + Math.floor(current).toLocaleString() + suffix
  );

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      spring.set(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay, spring]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <Card className="p-5 bg-card border-card-border relative overflow-hidden group">
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {label}
            </span>
            <Icon className={`w-5 h-5 ${color} opacity-50`} />
          </div>
          
          <motion.div 
            className={`text-3xl font-bold font-mono ${color}`}
          >
            {mounted && display}
          </motion.div>

          {/* Animated underline */}
          <motion.div
            className={`h-1 rounded-full ${color.replace('text-', 'bg-')}`}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: delay / 1000 + 0.5 }}
          />
        </div>
      </Card>
    </motion.div>
  );
}
