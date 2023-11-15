import {defineField, defineType} from 'sanity'
import {slugOptions} from '../../utils/slugInternationalization'

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'sections',
      type: 'sections',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'The slug has to match the product handle in Shopify.',
      title: 'Slug',
      validation: (Rule) => Rule.required(),
      options: slugOptions,
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
})
