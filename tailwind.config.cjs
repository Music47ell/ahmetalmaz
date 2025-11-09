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
      colors: {
        türkiye: '#E30A17',
      },
      typography: ({ theme }) => ({
        // default disables all prose styling globally
        DEFAULT: { css: disabledCss },
        sm: { css: disabledCss },
        lg: { css: disabledCss },
        xl: { css: disabledCss },
        '2xl': { css: disabledCss },

        // custom blog styling applied only when wrapping with `blog-prose`
        'blog-prose': {
          css: {
            h1: {
              color: theme('colors.blue.600'),
              fontWeight: '700',
              fontSize: theme('fontSize.4xl')[0],
            },
            h2: {
              color: theme('colors.blue.500'),
              fontWeight: '600',
              fontSize: theme('fontSize.3xl')[0],
            },
            a: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem', // Tailwind's gap-2
              color: theme('colors.red.500'),
              textDecoration: 'underline',
              backgroundColor: 'rgba(156,163,175,0.1)', // bg-gray-500/10
              borderRadius: '0.375rem', // rounded-md
              padding: '0 0.25rem', // px-1
              transitionProperty: 'background-color',
              transitionDuration: '200ms',
              '&:hover': {
                backgroundColor: 'rgba(239,68,68,0.2)', // hover:bg-red-500/20
              },
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.white'),
              padding: '1rem',
              borderRadius: '0.5rem',
              overflowX: 'auto',
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
            },
          },
        },
      }),
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')],
};
