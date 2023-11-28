import {defineField, defineType} from 'sanity'
import {paddingBottom, paddingTop} from '../objects/global/paddingOptions'

export default defineType({
  name: 'header',
  type: 'document',
  fields: [
    defineField({
      name: 'paddingTop',
      title: 'Top padding',
      type: 'paddingTop',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Bottom padding',
      type: 'paddingBottom',
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
