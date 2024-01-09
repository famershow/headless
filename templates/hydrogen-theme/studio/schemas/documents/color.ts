import {StringRule, defineField, defineType} from 'sanity';
import {IconPalette} from '../../components/icons/Palette';
import {ColorSchemeMedia} from '../../components/ColorScheme';

export default defineType({
  name: 'colorScheme',
  title: 'Color schemes',
  type: 'document',
  icon: IconPalette,
  preview: {
    select: {
      title: 'name',
      background: 'background',
      text: 'text',
    },
    prepare({title, background, text}: any) {
      return {
        title,
        media: ColorSchemeMedia({background, text}),
      };
    },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Scheme name',
      type: 'string',
      validation: (Rule: StringRule) => Rule.required(),
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'colorPicker',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'colorPicker',
    }),
    defineField({
      name: 'primaryButtonBackground',
      type: 'colorPicker',
    }),
    defineField({
      name: 'primaryButtonLabel',
      type: 'colorPicker',
    }),
    defineField({
      name: 'outlineButton',
      type: 'colorPicker',
    }),
  ],
});
