import {defineField, defineType} from 'sanity'

const GROUPS = [
  {
    name: 'navigation',
    title: 'Navigation',
    default: true,
  },
  {
    name: 'settings',
    title: 'Settings',
  },
]

export default defineType({
  name: 'header',
  type: 'document',
  groups: GROUPS,
  fields: [
    defineField({
      name: 'menu',
      group: 'navigation',
      type: 'internationalizedArrayHeaderNavigation',
    }),
    defineField({
      name: 'colorScheme',
      title: 'Color scheme',
      type: 'reference',
      group: 'settings',
      to: [{type: 'colorScheme'}],
    }),
    defineField({
      name: 'padding',
      title: 'Header padding',
      type: 'padding',
      group: 'settings',
    }),
    defineField({
      name: 'desktopLogoWidth',
      title: 'Desktop logo width',
      type: 'rangeSlider',
      group: 'settings',
      options: {
        min: 0,
        max: 400,
        suffix: 'px',
      },
      initialValue: 100,
      validation: (Rule: any) => Rule.min(0).max(400),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Header'}),
  },
})
