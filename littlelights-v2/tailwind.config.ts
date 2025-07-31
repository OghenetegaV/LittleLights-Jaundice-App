// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  // The 'content' array tells Tailwind which files to scan for utility classes.
  // Ensure these paths correctly point to all your component and page files.
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Include if you have a 'pages' directory (older Next.js structure)
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Path to your reusable components
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Path to your App Router pages and layouts
  ],
  theme: {
    extend: {
      // Custom keyframes are defined here for animations.
      keyframes: {
        // Keyframes for fading in and moving down
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Keyframes for fading in and moving up
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Keyframes for a subtle bouncing effect
        'bounce-subtle': {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        // Keyframes for a general fade-in effect
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Keyframes for a slower pulsing effect
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      // Animations are defined here, linking keyframes to durations and iterations.
      animation: {
        'fade-in-down': 'fade-in-down 0.7s ease-out forwards', // Fades in and moves down over 0.7 seconds
        'fade-in-up': 'fade-in-up 0.7s ease-out forwards', // Fades in and moves up over 0.7 seconds
        'bounce-subtle': 'bounce-subtle 1.5s infinite', // Subtle bounce that repeats infinitely
        'fade-in': 'fade-in 0.5s ease-out forwards', // Quick fade-in over 0.5 seconds
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Slow pulse that repeats infinitely
      },
    },
  },
  plugins: [], // Any Tailwind CSS plugins would be listed here
};

export default config;
