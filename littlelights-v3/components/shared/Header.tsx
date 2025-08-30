// File: components/shared/Header.tsx
// This component provides the main header for the dashboard page.

import React from 'react';

// Define the props for the Header component
interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <header className="flex justify-between items-center py-4 px-2 animate-[fadeIn_0.5s_ease-in-out]">
      <h1 className="text-xl font-semibold text-teal-700 dark:text-teal-400">Little Lights</h1>
      <div className="flex items-center space-x-4">
        {/* Dark mode toggle button */}
        <button
          aria-label="Toggle dark mode"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.182a.75.75 0 00-1.06-1.06L15 7.94V6a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v1.94L7.166 5.122a.75.75 0 00-1.06 1.06L7.94 9h-1.94a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75h1.94L5.122 16.834a.75.75 0 001.06 1.06L9 16.06v1.94a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75v-1.94l1.834 1.834a.75.75 0 001.06-1.06L16.06 15h1.94a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.75-.75h-1.94l1.834-1.834a.75.75 0 001.06-1.06z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        {/* Menu button */}
        <button
          aria-label="Open menu"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
