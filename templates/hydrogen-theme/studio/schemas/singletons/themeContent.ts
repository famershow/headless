import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'themeContent',
  type: 'document',
  groups: [
    {name: 'general', title: 'General'},
    {name: 'products', title: 'Products'},
  ],
  fields: [
    defineField({
      title: 'Cart',
      name: 'cart',
      type: 'object',
      group: 'general',
      fields: [
        defineField({
          title: 'View',
          name: 'view',
          type: 'internationalizedArrayString',
        }),
      ],
      initialValue: {
        view: 'View cart',
      },
    }),
    defineField({
      title: 'Product',
      name: 'product',
      type: 'object',
      group: 'products',
      fields: [
        defineField({
          title: 'Add to cart',
          name: 'addToCart',
          type: 'internationalizedArrayString',
        }),
      ],
      initialValue: {
        addToCart: 'Add to cart',
      },
    }),
  ],
  preview: {
    prepare: () => ({title: 'Theme Content'}),
  },
})
