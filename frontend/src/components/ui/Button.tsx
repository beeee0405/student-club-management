import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus-visible:ring-blue-500 shadow-sm hover:shadow-md': variant === 'default',
            'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus-visible:ring-red-500 shadow-sm hover:shadow-md': variant === 'destructive',
            'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-400': variant === 'outline',
            'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
            'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400': variant === 'ghost',
            'underline-offset-4 hover:underline text-blue-600': variant === 'link',
          },
          {
            'h-10 py-2 px-4 text-base gap-2': size === 'default',
            'h-9 px-3 text-sm gap-1.5': size === 'sm',
            'h-11 px-6 text-lg gap-2': size === 'lg',
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

export default Button;