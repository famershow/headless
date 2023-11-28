import type { Selection } from "groqd";
import { q } from "groqd";

/*
|--------------------------------------------------------------------------
| Hero Section
|--------------------------------------------------------------------------
*/
export const HERO_SECTION_FRAGMENT = {
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
export const SECTIONS_LIST_FRAGMENT = {
  '_type == "heroSection"': HERO_SECTION_FRAGMENT,
  '_type == "ctaSection"': CTA_SECTION_FRAGMENT,
};
