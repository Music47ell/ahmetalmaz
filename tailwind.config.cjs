/** @type {import('tailwindcss').Config} */

const disabledCss = {
  'blockquote p:first-of-type::before': false,
  'blockquote p:last-of-type::after': false,
  pre: false,
  code: false,
  'pre code': false,
  'code::before': false,
  'code::after': false,
};

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
       animation: {
        'spin-slow': 'spin 3s linear infinite',
        'equalizer-1': 'equalizer 0.5s ease-in-out infinite',
        'equalizer-2': 'equalizer 0.6s ease-in-out infinite 0.1s',
        'equalizer-3': 'equalizer 0.4s ease-in-out infinite 0.2s',
        'equalizer-4': 'equalizer 0.55s ease-in-out infinite 0.05s',
      },
      keyframes: {
        equalizer: {
          '0%, 100%': { height: '0.25rem' },
          '50%': { height: '0.75rem' },
        },
      },
      typography: ({ theme }) => ({
        // default disables all prose styling globally
        DEFAULT: { css: disabledCss },
        sm: { css: disabledCss },
        lg: { css: disabledCss },
        xl: { css: disabledCss },
        '2xl': { css: disabledCss },
      }),
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')],
};
