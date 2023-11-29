import type { Selection } from "groqd";
import { q, z } from "groqd";

import { COLOR_SCHEME_FRAGMENT } from "./fragments";

/*
|--------------------------------------------------------------------------
| Section Settings
|--------------------------------------------------------------------------
*/
export const SECTION_SETTINGS_FRAGMENT = q("settings").grab({
  colorScheme: q("colorScheme").deref().grab(COLOR_SCHEME_FRAGMENT),
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
| Hero Section
|--------------------------------------------------------------------------
*/
export const HERO_SECTION_FRAGMENT = {
  _type: z.enum(["heroSection"]),
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
| CTA Section
|--------------------------------------------------------------------------
*/
export const CTA_SECTION_FRAGMENT = {
  _type: z.enum(["ctaSection"]),
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
  "_type == 'heroSection'": HERO_SECTION_FRAGMENT,
  "_type == 'ctaSection'": CTA_SECTION_FRAGMENT,
};

/*
|--------------------------------------------------------------------------
| Sections Fragment
|--------------------------------------------------------------------------
*/
export const SECTIONS_FRAGMENT = q("sections[]", { isArray: true })
  .select(SECTIONS_LIST_SELECTION)
  .nullable();
