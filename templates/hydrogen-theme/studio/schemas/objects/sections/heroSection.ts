import {defineField} from 'sanity'

export default defineField({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}: any) {
      return {
        title: title?.[0]?.value || 'Missing title',
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
})
