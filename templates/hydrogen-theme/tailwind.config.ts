import type {Config} from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'color-scheme-bg': 'rgb(var(--backgroundColor) / <alpha-value>)',
        'color-scheme-text': 'rgb(var(--textColor) / <alpha-value>)',
      },
    },
  },
  plugins: [
    formsPlugin,
    typographyPlugin,
    plugin(({addComponents}) => {
      addComponents({
        '.color-scheme': {
          backgroundColor: 'rgb(var(--backgroundColor))',
          color: 'rgb(var(--textColor))',
        },
        '.inverted-color-scheme': {
          backgroundColor: 'rgb(var(--textColor))',
          color: 'rgb(var(--backgroundColor))',
        },
        '.section-padding': {
          paddingBottom: 'calc(var(--paddingBottom) * .75)',
          paddingTop: 'calc(var(--paddingTop) * .75)',
          '@screen sm': {
            paddingBottom: 'var(--paddingBottom)',
            paddingTop: 'var(--paddingTop)',
          },
        },
      });
    }),
  ],
} satisfies Config;
