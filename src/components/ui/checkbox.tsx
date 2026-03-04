import * as React from 'react';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className={cn(
          // Skeuomorphic checkbox
          'peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded',
          // Unchecked state - raised surface
          'border border-border bg-gradient-to-b from-card to-input/30',
          'shadow-[inset_0_1px_2px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.7)]',
          // Focus state
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          // Disabled
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Checked state - pressed/embossed with color
          'data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-primary data-[state=checked]:to-primary/90',
          'data-[state=checked]:border-primary/80',
          'data-[state=checked]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_0_0_2px_rgba(0,0,0,0.1)]',
          'data-[state=checked]:text-primary-foreground',
          className
        )}
        {...props}
      />
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
