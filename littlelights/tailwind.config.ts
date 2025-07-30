    // tailwind.config.ts
    import type { Config } from 'tailwindcss';

    const config: Config = {
      content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      theme: {
        extend: {
          // Defines custom keyframes for animations
          keyframes: {
            'fade-in-down': {
              '0%': {
                opacity: '0',
                transform: 'translateY(-20px)',
              },
              '100%': {
                opacity: '1',
                transform: 'translateY(0)',
              },
            },
            'fade-in-up': {
              '0%': {
                opacity: '0',
                transform: 'translateY(20px)',
              },
              '100%': {
                opacity: '1',
                transform: 'translateY(0)',
              },
            },
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
          },
          // Apply keyframes as animations
          animation: {
            'fade-in-down': 'fade-in-down 0.7s ease-out forwards', // 0.7s duration, ease-out, stays at end
            'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
            'bounce-subtle': 'bounce-subtle 1.5s infinite', // 1.5s duration, infinite loop
          },
        },
      },
      plugins: [],
    };

    export default config;
    