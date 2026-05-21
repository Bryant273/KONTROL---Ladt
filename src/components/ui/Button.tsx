import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-black text-white hover:bg-zinc-800 shadow-sm disabled:bg-zinc-400',
      secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 disabled:bg-zinc-50',
      outline: 'bg-transparent border border-zinc-200 text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300',
      ghost: 'bg-transparent text-zinc-600 hover:bg-zinc-50 hover:text-black',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      icon: 'h-10 w-10 p-2',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
