import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface MatchScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({ score, size = 'md', showLabel = true }) => {
  let colorStyles = 'bg-primary/10 text-primary border-primary/40 shadow-glow-sm';
  if (score < 50) {
    colorStyles = 'bg-muted text-muted-foreground border-border';
  } else if (score < 75) {
    colorStyles = 'bg-amber-500/10 text-amber-400 border-amber-500/40';
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-3 py-1 text-sm font-bold gap-1.5',
    lg: 'px-4 py-1.5 text-base font-extrabold gap-2',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border tracking-wide uppercase font-mono',
        colorStyles,
        sizes[size]
      )}
    >
      <Sparkles className="w-3.5 h-3.5 fill-current" />
      <span>{score}% {showLabel && 'MATCH'}</span>
    </div>
  );
};
