// File: components/ui/button.tsx
// A reusable and styled button component.

import React from 'react';
import { twMerge } from 'tailwind-merge';

// Define the ButtonProps interface for component props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
}

// Button component using Tailwind CSS for styling
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    // Determine the base and variant-specific styles
    const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2';
    
    let variantStyles = '';
    if (variant === 'default') {
      variantStyles = 'bg-teal-600 text-white shadow-md hover:bg-teal-700';
    } else if (variant === 'outline') {
      variantStyles = 'border border-gray-300 bg-white shadow-sm hover:bg-gray-100';
    } else if (variant === 'ghost') {
      variantStyles = 'hover:bg-gray-100 text-gray-800';
    }

    // Merge custom class names with the base and variant styles
    const mergedClassName = twMerge(baseStyles, variantStyles, className);

    return (
      <button className={mergedClassName} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
