import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          // Skeuomorphic base styles
          'relative overflow-hidden',
          {
            // Default - Primary button with gradient and shadow
            'border border-primary/80 bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-x-px active:translate-y-0 active:shadow-sm':
              variant === 'default',
            // Destructive
            'border border-destructive/80 bg-gradient-to-b from-destructive to-destructive/90 text-destructive-foreground shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm':
              variant === 'destructive',
            // Outline - Skeuomorphic raised surface
            'border border-border bg-gradient-to-b from-card to-card/95 shadow-sm hover:-translate-y-0.5 hover:bg-muted/50 hover:shadow-md active:translate-y-0 active:shadow-sm':
              variant === 'outline',
            // Secondary
            'border border-border bg-gradient-to-b from-secondary to-secondary/95 shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm':
              variant === 'secondary',
            // Ghost - Subtle hover
            'hover:-translate-y-0.5 hover:bg-muted/50': variant === 'ghost',
            // Link
            'text-primary underline-offset-4 hover:underline': variant === 'link',
          },
          {
            // Size variations
            'h-10 px-5 py-2.5': size === 'default',
            'h-9 rounded-md px-3.5': size === 'sm',
            'h-11 rounded-lg px-8 text-base': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
