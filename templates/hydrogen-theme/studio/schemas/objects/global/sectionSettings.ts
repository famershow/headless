import {defineField} from 'sanity'

export default defineField({
  type: 'object',
  name: 'sectionSettings',
  fields: [
    defineField({
      name: 'colorScheme',
      title: 'Color scheme',
      type: 'reference',
      to: [{type: 'colorScheme'}],
    }),
    defineField({
      name: 'paddingTop',
      title: 'Top padding',
      type: 'rangeSlider',
      options: {
        min: 0,
        max: 200,
        suffix: 'px',
      },
      initialValue: 80,
      validation: (Rule: any) => Rule.min(0).max(200),
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Bottom padding',
      type: 'rangeSlider',
      options: {
        min: 0,
        max: 200,
        suffix: 'px',
      },
      initialValue: 80,
      validation: (Rule: any) => Rule.min(0).max(200),
    }),
    defineField({
      type: 'code',
      name: 'customCss',
      title: 'Custom CSS',
      options: {
        language: 'css',
        languageAlternatives: [
          {
            title: 'CSS',
            value: 'css',
          },
        ],
      },
    }),
  ],
})
