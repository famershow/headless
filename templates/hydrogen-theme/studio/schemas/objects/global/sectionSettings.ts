import {defineField} from 'sanity'
import {paddingBottom, paddingTop} from './paddingOptions'

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
      type: 'paddingTop',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Bottom padding',
      type: 'paddingBottom',
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
