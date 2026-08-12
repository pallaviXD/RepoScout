import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'filled-neutral';
  size?: 'sm' | 'md' | 'lg';
  surface?: 'light' | 'dark'; // light surface (default) or dark hero surface
  isLoading?: boolean;
}

/**
 * monopo saigon Button System
 * ─────────────────────────────────────────────────────────────────
 * primary / outline  →  Ghost Pill (transparent, 1px border, 75px radius)
 * ghost              →  Underline-free text link (no border, no radius)
 * secondary          →  Ghost Pill secondary weight
 * filled-neutral     →  Filled Neutral Pill (slate-pill bg) — consent/utility only
 * danger             →  Filled Neutral Pill on dark bg
 *
 * surface='dark'     →  flips border/text to white for hero/dark band usage
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      surface = 'light',
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDark = surface === 'dark';

    const base =
      'inline-flex items-center justify-center font-sans font-normal transition-all ' +
      'focus:outline-none focus-visible:outline focus-visible:outline-1 ' +
      'focus-visible:outline-obsidian disabled:opacity-40 disabled:cursor-not-allowed ' +
      'cursor-pointer leading-none tracking-normal';

    const variants: Record<string, string> = {
      // Ghost Pill — primary action
      primary: isDark
        ? 'bg-transparent border border-white/30 text-white rounded-pill hover:border-white/60'
        : 'bg-transparent border border-obsidian text-obsidian rounded-pill hover:border-obsidian/60',

      // Ghost Pill — secondary (same geometry, slightly muted)
      secondary: isDark
        ? 'bg-transparent border border-white/20 text-white/80 rounded-pill hover:border-white/40'
        : 'bg-transparent border border-obsidian/40 text-obsidian/70 rounded-pill hover:border-obsidian',

      // Ghost Pill on outline call — alias for primary
      outline: isDark
        ? 'bg-transparent border border-white/30 text-white rounded-pill hover:border-white/60'
        : 'bg-transparent border border-obsidian text-obsidian rounded-pill hover:border-obsidian/50',

      // Underline-free text link — nav / inline
      ghost:
        'bg-transparent text-felt-gray hover:text-obsidian rounded-none border-0 p-0',

      // Filled Neutral Pill — cookie consent / utilitarian only
      'filled-neutral':
        'bg-slate-pill border border-white text-white rounded-pill hover:bg-inkstone',

      // Danger (maps to filled-neutral on dark)
      danger:
        'bg-slate-pill border border-white/40 text-white rounded-pill hover:bg-inkstone',
    };

    const sizes: Record<string, string> = {
      sm: 'text-[11px] px-[20px] py-[7px] gap-1.5',
      md: 'text-[16px] px-[33px] py-[11px] gap-2',
      lg: 'text-[16px] px-[40px] py-[13px] gap-2.5',
    };

    // Ghost text-link ignores size padding
    const ghostSize = {
      sm: 'text-[11px] gap-1',
      md: 'text-[12px] gap-1.5',
      lg: 'text-[16px] gap-2',
    };

    const sizeClass = variant === 'ghost'
      ? ghostSize[size]
      : sizes[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          base,
          variants[variant],
          sizeClass,
          // expressive transition on transform/border
          'transition-[border-color,letter-spacing,opacity] duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]',
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
