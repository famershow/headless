import { q } from "groqd";

/*
|--------------------------------------------------------------------------
| Hero Section
|--------------------------------------------------------------------------
*/
export const HERO_SECTION_FRAGMENT = {
  title: q.string(),
};

/*
|--------------------------------------------------------------------------
| CTA Section
|--------------------------------------------------------------------------
*/
export const CTA_SECTION_FRAGMENT = {
  title: q.string(),
};

/*
|--------------------------------------------------------------------------
| List of sections
|--------------------------------------------------------------------------
*/
export const SECTIONS_LIST_FRAGMENT = {
  '_type == "heroSection"': HERO_SECTION_FRAGMENT,
  '_type == "ctaSection"': CTA_SECTION_FRAGMENT,
};
