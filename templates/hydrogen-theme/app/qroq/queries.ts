import {q} from 'groqd';

import {
  COLOR_SCHEME_FRAGMENT,
  FONT_CATEGORY_FRAGMENT,
  MENU_FRAGMENT,
  SETTINGS_FRAGMENT,
} from './fragments';
import {SECTIONS_FRAGMENT} from './sections';
import {FOOTERS_FRAGMENT} from './footers';

/*
|--------------------------------------------------------------------------
| Page Query
|--------------------------------------------------------------------------
*/
export const PAGE_QUERY = q('*')
  .filter(
    ` (
        _type == "page" &&
        ($handle != "home" && slug[_key == $language][0].value.current == $handle) ||
        ($handle != "home" && slug[_key == $defaultLanguage][0].value.current == $handle)
      ) ||
      (
        _type == "home" &&
        $handle == "home"
      )
    `,
  )
  .grab({
    sections: SECTIONS_FRAGMENT,
  })
  .slice(0)
  .nullable();

/*
|--------------------------------------------------------------------------
| Product Query
|--------------------------------------------------------------------------
*/
export const PRODUCT_QUERY = q('*')
  .filter(`_type == "product" && slug.current == $productHandle`)
  .grab({
    slug: q.string(),
    sections: SECTIONS_FRAGMENT,
  })
  .slice(0)
  .nullable();

/*
|--------------------------------------------------------------------------
| CMS Settings Queries
|--------------------------------------------------------------------------
*/
export const FONTS_QUERY = q('*')
  .filter("_type == 'typography'")
  .grab({
    heading: q('heading[]', {isArray: true})
      .grab(FONT_CATEGORY_FRAGMENT)
      .nullable(),
    body: q('body[]', {isArray: true}).grab(FONT_CATEGORY_FRAGMENT).nullable(),
    extra: q('extra[]', {isArray: true})
      .grab(FONT_CATEGORY_FRAGMENT)
      .nullable(),
  })
  .order('_createdAt asc')
  .slice(0)
  .nullable();

export const DEFAULT_COLOR_SCHEME_QUERY = q('*')
  .filter("_type == 'colorScheme'")
  .grab(COLOR_SCHEME_FRAGMENT)
  .order('_createdAt asc')
  .slice(0);

export const SETTINGS_QUERY = q('*')
  .filter("_type == 'settings'")
  .grab(SETTINGS_FRAGMENT)
  .slice(0)
  .nullable();

export const HEADER_QUERY = q('*')
  .filter("_type == 'header'")
  .grab({
    desktopLogoWidth: q.number().nullable(),
    padding: q
      .object({
        top: q.number().nullable(),
        bottom: q.number().nullable(),
      })
      .nullable(),
    colorScheme: q('colorScheme').deref().grab(COLOR_SCHEME_FRAGMENT),
    menu: MENU_FRAGMENT,
  })
  .slice(0)
  .nullable();

export const FOOTER_QUERY = q('*')
  .filter("_type == 'footer'")
  .grab({
    sections: SECTIONS_FRAGMENT,
    footer: FOOTERS_FRAGMENT,
  })
  .slice(0)
  .nullable();

export const ROOT_QUERY = q('')
  .grab({
    defaultColorScheme: DEFAULT_COLOR_SCHEME_QUERY,
    fonts: FONTS_QUERY,
    settings: SETTINGS_QUERY,
    header: HEADER_QUERY,
    footer: FOOTER_QUERY,
  })
  .nullable();
