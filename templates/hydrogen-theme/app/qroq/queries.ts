import {q} from 'groqd';

import {FOOTERS_FRAGMENT} from './footers';
import {
  COLOR_SCHEME_FRAGMENT,
  FONT_FRAGMENT,
  MENU_FRAGMENT,
  SETTINGS_FRAGMENT,
} from './fragments';
import {PRODUCT_SECTIONS_FRAGMENT, SECTIONS_FRAGMENT} from './sections';
import {THEME_CONTENT_FRAGMENT} from './themeContent';

/*
|--------------------------------------------------------------------------
| Page Query
|--------------------------------------------------------------------------
*/
export const PAGE_QUERY = q('*')
  .filter(
    `(
      _type == "page" &&
        ($handle != "home" && slug.current == $handle)
      ) || (
        _type == "home" &&
        $handle == "home"
      )
    `,
  )
  .grab({
    _type: q.literal('page'),
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
  .filter(`_type == "product" && store.slug.current == $productHandle`)
  .grab({
    _type: q.literal('product'),
    store: q('store').grab({
      gid: q.string(),
    }),
    template: q('template').deref().grab({
      sections: PRODUCT_SECTIONS_FRAGMENT,
    }),
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
    body: q('body').grab(FONT_FRAGMENT),
    extra: q('extra').grab(FONT_FRAGMENT),
    heading: q('heading').grab(FONT_FRAGMENT),
  })
  .order('_createdAt asc')
  .slice(0)
  .nullable();

export const DEFAULT_COLOR_SCHEME_QUERY = q('*')
  .filter("_type == 'colorScheme' && default == true")
  .grab(COLOR_SCHEME_FRAGMENT)
  .slice(0)
  .nullable();

export const DEFAULT_PRODUCT_TEMPLATE = q('*')
  .filter("_type == 'productTemplate' && default == true")
  .grab({
    _type: q.literal('productTemplate'),
    name: q.string().nullable(),
    sections: PRODUCT_SECTIONS_FRAGMENT,
  })
  .slice(0)
  .nullable();

export const DEFAULT_COLLECTION_TEMPLATE = q('*')
  .filter("_type == 'collectionTemplate' && default == true")
  .slice(0)
  .nullable();

export const SETTINGS_QUERY = q('*')
  .filter("_type == 'settings'")
  .grab(SETTINGS_FRAGMENT)
  .slice(0)
  .nullable();

export const HEADER_QUERY = q('*')
  .filter("_type == 'header'")
  .grab({
    colorScheme: q('colorScheme').deref().grab(COLOR_SCHEME_FRAGMENT),
    desktopLogoWidth: q.number().nullable(),
    menu: MENU_FRAGMENT,
    padding: q
      .object({
        bottom: q.number().nullable(),
        top: q.number().nullable(),
      })
      .nullable(),
    showSeparatorLine: q.boolean().nullable(),
  })
  .slice(0)
  .nullable();

export const FOOTER_QUERY = q('*')
  .filter("_type == 'footer'")
  .grab({
    footer: FOOTERS_FRAGMENT,
    sections: SECTIONS_FRAGMENT,
  })
  .slice(0)
  .nullable();

export const THEME_CONTENT_QUERY = q('*')
  .filter("_type == 'themeContent'")
  .grab(THEME_CONTENT_FRAGMENT)
  .slice(0)
  .nullable();

export const ROOT_QUERY = q('')
  .grab({
    defaultCollectionTemplate: DEFAULT_COLLECTION_TEMPLATE,
    defaultColorScheme: DEFAULT_COLOR_SCHEME_QUERY,
    defaultProductTemplate: DEFAULT_PRODUCT_TEMPLATE,
    fonts: FONTS_QUERY,
    footer: FOOTER_QUERY,
    header: HEADER_QUERY,
    settings: SETTINGS_QUERY,
    themeContent: THEME_CONTENT_QUERY,
  })
  .nullable();
