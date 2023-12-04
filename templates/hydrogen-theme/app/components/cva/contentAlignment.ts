import type {VariantProps} from 'class-variance-authority';

import {cva} from 'class-variance-authority';

export type ContentAlignmentVariantProps = VariantProps<
  typeof contentAlignment
>;

export const contentAlignment = cva('flex h-full', {
  variants: {
    required: {
      bottom_center: 'items-end justify-center',
      bottom_left: 'items-end justify-start',
      bottom_right: 'items-end justify-end',
      middle_center: 'items-center justify-center',
      middle_left: 'items-center justify-start',
      middle_right: 'items-center justify-end',
      top_center: 'items-start justify-center',
      top_left: 'items-start justify-start',
      top_right: 'items-start justify-end',
    },
  },
});

export const contentAlignmentVariants = (props: ContentAlignmentVariantProps) =>
  contentAlignment(props);
