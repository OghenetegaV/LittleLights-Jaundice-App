// File: app/(auth)/layout.tsx
// This is a layout file for the authentication pages.
// It wraps all pages within the (auth) route group to provide a consistent UI.

import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
