import {defineField} from 'sanity';

export default defineField({
  name: 'featuredCollectionSection',
  title: 'Featured Collection',
  type: 'object',
  fields: [
    defineField({
      name: 'collection',
      type: 'reference',
      to: [{type: 'collection'}],
    }),
    defineField({
      type: 'sectionSettings',
      name: 'settings',
    }),
  ],
  preview: {
    select: {
      collection: 'collection.store',
    },
    prepare({collection}: any) {
      return {
        title: collection.title,
        subtitle: 'Featured Collection',
        media: () => <img src={collection.imageUrl} alt={collection.title} />,
      };
    },
  },
});
