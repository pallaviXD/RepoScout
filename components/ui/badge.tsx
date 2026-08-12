import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * monopo saigon Badge System
 * ─────────────────────────────────────────────────────────────────
 * 75px full-pill radius — same pill geometry as buttons
 * Strictly monochrome palette — no hue variants
 * default:  obsidian text, obsidian border, transparent bg
 * muted:    felt-gray text + border
 * inverse:  paper text, obsidian bg (dark pill)
 * outline:  felt-gray border, transparent bg (quiet annotation)
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'purple' | 'inverse' | 'muted';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const base =
    'inline-flex items-center px-[12px] py-[4px] rounded-full text-[11px] font-[400] ' +
    'leading-[1.36] border transition-colors duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)]';

  const variants: Record<string, string> = {
    // Monochrome variants
    default:  'bg-transparent text-obsidian border-obsidian/30 hover:border-obsidian/60',
    primary:  'bg-transparent text-obsidian border-obsidian/30 hover:border-obsidian/60',
    muted:    'bg-transparent text-felt-gray border-felt-gray/40',
    inverse:  'bg-obsidian text-paper border-obsidian',
    outline:  'bg-transparent text-felt-gray border-felt-gray/30',

    // These retain their names for compatibility but map to monochrome
    secondary: 'bg-transparent text-felt-gray border-black/15',
    success:   'bg-transparent text-obsidian border-obsidian/25',
    warning:   'bg-transparent text-obsidian border-obsidian/25',
    purple:    'bg-transparent text-obsidian border-obsidian/25',
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
