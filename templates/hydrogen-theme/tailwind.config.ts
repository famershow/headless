import type {Config} from 'tailwindcss';

import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
  },
  plugins: [formsPlugin, typographyPlugin],
} satisfies Config;
