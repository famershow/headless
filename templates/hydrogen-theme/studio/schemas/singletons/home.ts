import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'home',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      type: 'sections',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
})
