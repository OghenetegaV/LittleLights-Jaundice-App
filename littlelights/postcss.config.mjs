// postcss.config.mjs
// This configuration uses @tailwindcss/postcss as suggested by the error message.
export default {
  plugins: [
    require('@tailwindcss/postcss'), // Use the specific plugin package
    require('autoprefixer'), // Autoprefixer is still needed
  ],
};