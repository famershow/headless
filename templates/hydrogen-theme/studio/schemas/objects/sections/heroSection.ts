import {defineField} from 'sanity'

export default defineField({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      type: 'contentAlignment',
      name: 'contentAlignment',
    }),
    defineField({
      type: 'image',
      name: 'backgroundImage',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'overlayOpacity',
      type: 'overlayOpacity',
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  initialValue: {
    overlayOpacity: 0,
    contentAlignment: 'middle_center',
  },
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
})
