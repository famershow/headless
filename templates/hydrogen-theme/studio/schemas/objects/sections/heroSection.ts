import {defineField} from 'sanity'

export default defineField({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
})
