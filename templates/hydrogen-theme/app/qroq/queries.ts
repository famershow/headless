import { q } from "groqd";

import {
  COLOR_SCHEME_FRAGMENT,
  FONT_CATEGORY_FRAGMENT,
  SECTIONS_FRAGMENT,
} from "./fragments";

/*
|--------------------------------------------------------------------------
| Page Query
|--------------------------------------------------------------------------
*/
export const PAGE_QUERY = q("*")
  .filter(
    ` _type == "page" &&
      language in [$language, null] &&
      slug.current == $handle ||
      _type == "home" &&
      language in [$language, null]
    `
  )
  .grab({
    slug: q
      .object({
        current: q.string(),
      })
      .nullable(),
    sections: SECTIONS_FRAGMENT,
  })
  .slice(0)
  .nullable();

/*
|--------------------------------------------------------------------------
| Product Query
|--------------------------------------------------------------------------
*/

export const PRODUCT_QUERY = q("*")
  .filter(
    ` _type == "product" &&
      language in [$language, null] &&
      slug.current == $productHandle
    `
  )
  .grab({
    slug: q.object({
      current: q.string(),
    }),
    title: q.string(),
    sections: SECTIONS_FRAGMENT,
  })
  .slice(0)
  .nullable();

/*
|--------------------------------------------------------------------------
| CMS Settings Queries
|--------------------------------------------------------------------------
*/
export const FONTS_QUERY = q("*")
  .filter("_type == 'typography'")
  .grab({
    heading: q("heading[]", { isArray: true })
      .grab(FONT_CATEGORY_FRAGMENT)
      .nullable(),
    body: q("body[]", { isArray: true })
      .grab(FONT_CATEGORY_FRAGMENT)
      .nullable(),
    extra: q("extra[]", { isArray: true })
      .grab(FONT_CATEGORY_FRAGMENT)
      .nullable(),
  })
  .order("_createdAt asc")
  .slice(0)
  .nullable();

export const DEFAULT_COLOR_SCHEME_QUERY = q("*")
  .filter("_type == 'colorScheme'")
  .grab(COLOR_SCHEME_FRAGMENT)
  .order("_createdAt asc")
  .slice(0);

export const CMS_SETTINGS_QUERY = q("")
  .grab({
    defaultColorScheme: DEFAULT_COLOR_SCHEME_QUERY,
    fonts: FONTS_QUERY,
  })
  .nullable();
