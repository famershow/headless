import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'header',
  type: 'document',
  fields: [
    defineField({
      name: 'menu',
      type: 'internationalizedArrayHeaderNavigation',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Header'}),
  },
})
