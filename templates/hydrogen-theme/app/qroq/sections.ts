import type {Selection} from 'groqd';
import {q, z} from 'groqd';

import {COLOR_SCHEME_FRAGMENT, IMAGE_FRAGMENT} from './fragments';

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
  padding: q
    .object({
      top: q.number().nullable(),
      bottom: q.number().nullable(),
    })
    .nullable(),
  customCss: q
    .object({
      code: q.string().optional(),
    })
    .nullable(),
});

/*
|--------------------------------------------------------------------------
| Image Banner Section
|--------------------------------------------------------------------------
*/
export const IMAGE_BANNER_SECTION_FRAGMENT = {
  _type: z.enum(['imageBannerSection']),
  _key: q.string().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  backgroundImage: q('backgroundImage').grab(IMAGE_FRAGMENT).nullable(),
  bannerHeight: q.number().nullable(),
  overlayOpacity: q.number().nullable(),
  contentAlignment: z.enum(contentAlignmentValues).nullable(),
  animateContent: q.boolean().nullable(),
  title: [
    `coalesce(
      title[_key == $language][0].value,
      title[_key == $defaultLanguage][0].value,
    )`,
    q.string(),
  ],
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Featured Collection Section
|--------------------------------------------------------------------------
*/
export const FEATURED_COLLECTION_SECTION_FRAGMENT = {
  _type: z.enum(['featuredCollectionSection']),
  _key: q.string().nullable(),
  collection: q('collection')
    .deref()
    .grab({
      store: q('store').grab({
        gid: q.string(),
      }),
    })
    .nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Collection List Section
|--------------------------------------------------------------------------
*/
export const COLLECTION_LIST_SECTION_FRAGMENT = {
  _type: z.enum(['collectionListSection']),
  _key: q.string().nullable(),
  collections: q('collections[]', {isArray: true})
    .deref()
    .grab({
      store: q('store').grab({
        gid: q.string(),
      }),
    })
    .nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| CTA Section
|--------------------------------------------------------------------------
*/
export const CTA_SECTION_FRAGMENT = {
  _type: z.enum(['ctaSection']),
  _key: q.string().nullable(),
  settings: SECTION_SETTINGS_FRAGMENT,
  title: [
    `coalesce(
    title[_key == $language][0].value,
    title[_key == $defaultLanguage][0].value,
  )`,
    q.string(),
  ],
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| List of sections
|--------------------------------------------------------------------------
*/
export const SECTIONS_LIST_SELECTION = {
  "_type == 'imageBannerSection'": IMAGE_BANNER_SECTION_FRAGMENT,
  "_type == 'featuredCollectionSection'": FEATURED_COLLECTION_SECTION_FRAGMENT,
  "_type == 'collectionListSection'": COLLECTION_LIST_SECTION_FRAGMENT,
  "_type == 'ctaSection'": CTA_SECTION_FRAGMENT,
};

/*
|--------------------------------------------------------------------------
| Sections Fragment
|--------------------------------------------------------------------------
*/
export const SECTIONS_FRAGMENT = q('sections[]', {isArray: true})
  .select(SECTIONS_LIST_SELECTION)
  .nullable();
