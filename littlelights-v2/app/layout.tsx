// app/layout.tsx
// This file defines the root layout for the entire Next.js application.

import './globals.css'; // Imports global CSS styles.
import { Inter } from 'next/font/google'; // Imports the Inter font from Google Fonts.

const inter = Inter({ subsets: ['latin'] }); // Initializes the Inter font.

// Metadata for the application, used for SEO and browser tab title.
export const metadata = {
  title: 'LittleLights - Early Jaundice Detection', // Application title.
  description: 'An innovative mobile app for early neonatal jaundice screening.', // Application description.
};

// RootLayout component wraps all pages.
export default function RootLayout({
  children, // Represents the content of the current page.
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Applies the Inter font and ensures the body takes full height. */}
      <body className={`${inter.className} h-full`}>
        {children}
      </body>
    </html>
  );
}
