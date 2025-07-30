// app/layout.tsx
// This file defines the root layout for your entire Next.js application.
// It wraps all pages and is where you'd include global elements like HTML, Body, and global CSS.

import './globals.css'; // Import your global CSS file, which will include Tailwind directives
import { Inter } from 'next/font/google'; // Import Google Font (Inter is a good default)

// Initialize the Inter font with a subset for performance
const inter = Inter({ subsets: ['latin'] });

// Metadata for your application (SEO, browser tab title, etc.)
export const metadata = {
  title: 'LittleLights - Early Jaundice Detection', // App title for browser tab
  description: 'An innovative mobile app for early neonatal jaundice screening.', // App description
};

// RootLayout component that wraps all pages
export default function RootLayout({
  children, // children prop represents the content of the current page
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply the Inter font to the body */}
      <body className={inter.className}>
        {/* The children prop will render the content of the current page (e.g., app/page.tsx) */}
        {children}
      </body>
    </html>
  );
}
