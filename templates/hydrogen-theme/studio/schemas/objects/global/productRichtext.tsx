import {BadgeDollarSign, ShoppingCart, Text, Type} from 'lucide-react';
import {defineField} from 'sanity';

export default defineField({
  name: 'productRichtext',
  type: 'array',
  of: [
    {
      type: 'block',
    },
    {
      name: 'shopifyTitle',
      title: 'Title',
      type: 'object',
      fields: [
        defineField({
          name: 'titleProxy',
          title: 'Title',
          type: 'proxyString',
          options: {field: 'store.title'},
        }),
      ],
      icon: () => <Type size="18px" />,
      preview: {
        prepare: () => {
          return {
            title: 'Title',
          };
        },
      },
    },
    {
      name: 'shopifyDescription',
      title: 'Description',
      type: 'object',
      fields: [
        defineField({
          name: 'descriptionProxy',
          title: 'Description',
          type: 'proxyString',
          options: {field: 'store.descriptionHtml'},
        }),
      ],
      icon: () => <Text size="18px" />,
      preview: {
        prepare: () => {
          return {
            title: 'Description',
          };
        },
      },
    },
    {
      name: 'price',
      type: 'object',
      fields: [
        defineField({
          name: 'priceProxy',
          title: 'Price',
          type: 'proxyString',
          options: {field: 'store.priceRange.minVariantPrice'},
        }),
      ],
      icon: () => <BadgeDollarSign size="18px" />,
      preview: {
        prepare: () => {
          return {
            title: 'Price',
          };
        },
      },
    },
    {
      name: 'addToCartButton',
      type: 'object',
      fields: [
        defineField({
          name: 'size',
          type: 'string',
          options: {
            list: ['small', 'medium', 'large'],
          },
        }),
      ],
      icon: () => <ShoppingCart size="18px" />,
      preview: {
        prepare: () => {
          return {
            title: 'Add to cart button',
          };
        },
      },
    },
  ],
});
