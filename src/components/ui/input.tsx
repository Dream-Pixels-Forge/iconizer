import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base skeuomorphic input styles
          'flex h-10 w-full rounded-lg border border-border bg-gradient-to-b from-input/20 to-input/40 px-3 py-2 text-sm ring-offset-background transition-all duration-150',
          // Inner shadow for inset effect
          'shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.5)]',
          // Focus state
          'focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20',
          // Placeholder
          'placeholder:text-muted-foreground/60',
          // Disabled
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
