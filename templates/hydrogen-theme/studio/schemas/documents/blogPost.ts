import {defineField, defineType} from 'sanity'
import {slugOptions} from '../../utils/slugInternationalization'

export default defineType({
  name: 'blogPost',
  title: 'Blog posts',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
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
