import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * monopo saigon Input
 * ─────────────────────────────────────────────────────────────────
 * 0px border-radius (sharp editorial)
 * Hairline bottom border style (underline input feel)
 * No background fill — transparent on white canvas
 * Focus: border-color transitions to obsidian
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-0 text-felt-gray pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-none border-0 border-b border-black/20',
            'bg-transparent px-0 py-2',
            'text-[16px] font-[400] text-obsidian placeholder:text-felt-gray',
            'focus:outline-none focus:border-obsidian',
            'disabled:cursor-not-allowed disabled:opacity-40',
            'transition-[border-color] duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]',
            icon && 'pl-6',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
