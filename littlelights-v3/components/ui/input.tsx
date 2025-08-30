// File: components/ui/input.tsx
// A reusable and styled input component.

import React from 'react';
import { twMerge } from 'tailwind-merge';

// Define the InputProps interface for component props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// Input component using Tailwind CSS for styling
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    // Base styles for the input field
    const baseStyles = 'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50';
    
    // Merge custom class names with the base styles
    const mergedClassName = twMerge(baseStyles, className);

    return (
      <input
        type={type}
        className={mergedClassName}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
