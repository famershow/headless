import {defineField} from 'sanity'

import SectionsListInput from '../../../components/SectionsListInput'

export default defineField({
  title: 'Sections',
  name: 'sections',
  type: 'array',
  group: 'pagebuilder',
  of: [
    {
      type: 'heroSection',
    },
    {
      type: 'ctaSection',
    },
  ],
  components: {
    input: SectionsListInput,
  },
})
