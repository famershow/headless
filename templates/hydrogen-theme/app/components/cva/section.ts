import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';

export type SectionVariantProps = VariantProps<typeof sectionVariants>;

export const sectionVariants = cva(
  [
    'relative',
    // Background and text color from color scheme
    'color-scheme',
    // Padding top and bottom, 25% smaller on mobile
    'section-padding',
  ],
  {
    variants: {
      optional: {header: 'border-color-scheme-text/10 border-b'},
    },
  },
);

export const section = (props: SectionVariantProps) => sectionVariants(props);
