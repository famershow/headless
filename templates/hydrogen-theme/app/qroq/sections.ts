import type {Selection} from 'groqd';

import {q, z} from 'groqd';

import {
  ADD_TO_CART_BUTTON_BLOCK,
  SHOPIFY_DESCRIPTION_BLOCK,
  SHOPIFY_TITLE_BLOCK,
} from './blocks';
import {COLOR_SCHEME_FRAGMENT, IMAGE_FRAGMENT} from './fragments';
import {getIntValue} from './utils';

export const contentAlignmentValues = [
  'top_left',
  'top_center',
  'top_right',
  'middle_left',
  'middle_center',
  'middle_right',
  'bottom_left',
  'bottom_center',
  'bottom_right',
] as const;

/*
|--------------------------------------------------------------------------
| Section Settings
|--------------------------------------------------------------------------
*/
export const SECTION_SETTINGS_FRAGMENT = q('settings').grab({
  colorScheme: q('colorScheme').deref().grab(COLOR_SCHEME_FRAGMENT),
  customCss: q
    .object({
      code: q.string().optional(),
    })
    .nullable(),
  padding: q
    .object({
      bottom: q.number().nullable(),
      top: q.number().nullable(),
    })
    .nullable(),
});

/*
|--------------------------------------------------------------------------
| Image Banner Section
|--------------------------------------------------------------------------
*/
export const IMAGE_BANNER_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('imageBannerSection'),
  animateContent: q.boolean().nullable(),
  backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT).nullable(),
  bannerHeight: q.number().nullable(),
  contentAlignment: z.enum(contentAlignmentValues).nullable(),
  overlayOpacity: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  title: [getIntValue('title'), q.string()],
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Featured Collection Section
|--------------------------------------------------------------------------
*/
export const FEATURED_COLLECTION_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('featuredCollectionSection'),
  collection: q('collection')
    .deref()
    .grab({
      store: q('store').grab({
        gid: q.string(),
        title: q.string(),
      }),
    })
    .nullable(),
  desktopColumns: q.number().nullable(),
  maxProducts: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Featured Product Section
|--------------------------------------------------------------------------
*/
export const FEATURED_PRODUCT_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('featuredProductSection'),
  product: q('product')
    .deref()
    .grab({
      store: q('store').grab({
        gid: q.string(),
        title: q.string(),
      }),
    })
    .nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Product Information Section
|--------------------------------------------------------------------------
*/
export const PRODUCT_INFORMATION_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('productInformationSection'),
  richtext: [
    getIntValue('richtext'),
    q
      .array(
        q.union([
          SHOPIFY_TITLE_BLOCK,
          SHOPIFY_DESCRIPTION_BLOCK,
          ADD_TO_CART_BUTTON_BLOCK,
          q.contentBlock(),
        ]),
      )
      .nullable(),
  ],
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Collection List Section
|--------------------------------------------------------------------------
*/
export const COLLECTION_LIST_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('collectionListSection'),
  collections: q('collections[]', {isArray: true})
    .deref()
    .grab({
      store: q('store').grab({
        gid: q.string(),
      }),
    })
    .nullable(),
  desktopColumns: q.number().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| CTA Section
|--------------------------------------------------------------------------
*/
export const CTA_SECTION_FRAGMENT = {
  _key: q.string().nullable(),
  _type: q.literal('ctaSection'),
  settings: SECTION_SETTINGS_FRAGMENT,
  title: [getIntValue('title'), q.string()],
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| List of sections
|--------------------------------------------------------------------------
*/
export const SECTIONS_LIST_SELECTION = {
  "_type == 'collectionListSection'": COLLECTION_LIST_SECTION_FRAGMENT,
  "_type == 'ctaSection'": CTA_SECTION_FRAGMENT,
  "_type == 'featuredCollectionSection'": FEATURED_COLLECTION_SECTION_FRAGMENT,
  "_type == 'featuredProductSection'": FEATURED_PRODUCT_SECTION_FRAGMENT,
  "_type == 'imageBannerSection'": IMAGE_BANNER_SECTION_FRAGMENT,
};

/*
|--------------------------------------------------------------------------
| Sections Fragment
|--------------------------------------------------------------------------
*/
export const SECTIONS_FRAGMENT = q('sections[]', {isArray: true})
  .select(SECTIONS_LIST_SELECTION)
  .nullable();

export const PRODUCT_SECTIONS_FRAGMENT = q('sections[]', {isArray: true})
  .select({
    "_type == 'productInformationSection'":
      PRODUCT_INFORMATION_SECTION_FRAGMENT,
    ...SECTIONS_LIST_SELECTION,
  })
  .nullable();
