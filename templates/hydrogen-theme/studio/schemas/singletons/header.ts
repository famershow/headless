import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'header',
  type: 'document',
  fields: [
    defineField({
      title: 'Menu',
      name: 'menu',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
})
