import {ArrayOfObjectsInputProps, defineField} from 'sanity';

import SectionsListInput from '../../../components/SectionsListInput';

export default defineField({
  title: 'Sections',
  name: 'sections',
  type: 'array',
  group: 'pagebuilder',
  of: [
    {
      type: 'imageBannerSection',
    },
    {
      type: 'featuredCollectionSection',
    },
    {
      type: 'collectionListSection',
    },
    {
      type: 'ctaSection',
    },
  ],
  components: {
    input: (props: ArrayOfObjectsInputProps) =>
      SectionsListInput({type: 'section', ...props}),
  },
});
