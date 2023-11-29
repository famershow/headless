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
      name: 'padding',
      title: 'Padding',
      type: 'padding',
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
