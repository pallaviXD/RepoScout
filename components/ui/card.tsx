import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * monopo saigon Card System
 * ─────────────────────────────────────────────────────────────────
 * 0px border-radius (sharp editorial corners)
 * White background, hairline 1px border at rgba(0,0,0,0.12)
 * Hover: border darkens to rgba(0,0,0,0.3) — no shadow, no glow
 * No card chrome — the card IS the content
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white border border-black/10 rounded-none p-[34px]',
          'transition-[border-color] duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]',
          hoverEffect && 'hover:border-black/30',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-[8px] mb-[14px]', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-[18px] font-[400] leading-[1.21] text-obsidian tracking-normal', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-[16px] font-[400] leading-[1.15] text-felt-gray', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';
