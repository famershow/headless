import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'header',
  type: 'document',
  fields: [
    defineField({
      name: 'padding',
      title: 'Padding',
      type: 'padding',
    }),
    defineField({
      name: 'desktopLogoWidth',
      title: 'Desktop logo width',
      type: 'rangeSlider',
      options: {
        min: 0,
        max: 400,
        suffix: 'px',
      },
      initialValue: 100,
      validation: (Rule: any) => Rule.min(0).max(400),
    }),
    defineField({
      name: 'menu',
      type: 'internationalizedArrayHeaderNavigation',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Header'}),
  },
})
