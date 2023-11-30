import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';

export type ContentAlignmentVariantProps = VariantProps<
  typeof contentAlignment
>;

export const contentAlignment = cva('flex', {
  variants: {
    required: {
      top_left: 'items-start justify-start',
      top_center: 'items-start justify-center',
      top_right: 'items-start justify-end',
      middle_left: 'items-center justify-start',
      middle_center: 'items-center justify-center',
      middle_right: 'items-center justify-end',
      bottom_left: 'items-end justify-start',
      bottom_center: 'items-end justify-center',
      bottom_right: 'items-end justify-end',
    },
  },
});

export const contentAlignmentVariants = (props: ContentAlignmentVariantProps) =>
  contentAlignment(props);
