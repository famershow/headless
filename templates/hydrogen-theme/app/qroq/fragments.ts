import type {Selection} from 'groqd';
import {q} from 'groqd';

import {LINKS_LIST_SELECTION} from './links';

/*
|--------------------------------------------------------------------------
| Image Fragment
|--------------------------------------------------------------------------
*/
export const IMAGE_FRAGMENT = {
  _ref: q('asset').grabOne('_ref', q.string()),
  hotspot: q('hotspot')
    .grab({
      x: q.number(),
      y: q.number(),
      height: q.number(),
      width: q.number(),
    })
    .nullable(),
  crop: q('crop')
    .grab({
      top: q.number(),
      bottom: q.number(),
      left: q.number(),
      right: q.number(),
    })
    .nullable(),
  altText: q('asset').deref().grabOne('altText', q.string()).nullable(),
  url: q('asset').deref().grabOne('url', q.string()),
  width: q('asset').deref().grabOne('metadata.dimensions.width', q.number()),
  height: q('asset').deref().grabOne('metadata.dimensions.height', q.number()),
  blurDataURL: q('asset').deref().grabOne('metadata.lqip', q.string()),
};

/*
|--------------------------------------------------------------------------
| Menu Fragment
|--------------------------------------------------------------------------
*/
export const MENU_FRAGMENT = q(
  `coalesce(
    menu[_key == $language][0].value[],
    menu[_key == $defaultLanguage][0].value[],
  )[]`,
  {isArray: true},
)
  .select(LINKS_LIST_SELECTION)
  .nullable();

/*
|--------------------------------------------------------------------------
| Color Fragments
|--------------------------------------------------------------------------
*/
export const COLOR_FRAGMENT = {
  hsl: q('hsl').grab({
    h: q.number(),
    s: q.number(),
    l: q.number(),
  }),
  rgb: q('rgb').grab({
    r: q.number(),
    g: q.number(),
    b: q.number(),
  }),
  hex: q.string(),
  alpha: q.number(),
} satisfies Selection;

export const COLOR_SCHEME_FRAGMENT = {
  background: q('background').grab(COLOR_FRAGMENT).nullable(),
  text: q('text').grab(COLOR_FRAGMENT).nullable(),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Settings Fragments
|--------------------------------------------------------------------------
*/
export const SETTINGS_FRAGMENT = {
  logo: q('logo').grab(IMAGE_FRAGMENT).nullable(),
  favicon: q('favicon').grab(IMAGE_FRAGMENT).nullable(),
  socialMedia: q('socialMedia').grab({
    facebook: q.string().nullable(),
    instagram: q.string().nullable(),
    twitter: q.string().nullable(),
    youtube: q.string().nullable(),
  }),
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| Fonts Fragments
|--------------------------------------------------------------------------
*/
const FONT_ASSET_FRAGMENT = {
  url: q('asset').deref().grabOne('url', q.string()),
  extension: q('asset').deref().grabOne('extension', q.string()),
  mimeType: q('asset').deref().grabOne('mimeType', q.string()),
} satisfies Selection;

export const FONT_CATEGORY_FRAGMENT = {
  fontName: q.string(),
  fontType: q.string(),
  antialiased: q.boolean().nullable(),
  fontAssets: q('fontAssets[]', {isArray: true}).grab({
    fontWeight: q.number(),
    fontStyle: q.string(),
    fontName: ['^.fontName', q.string()],
    woff2: q('woff2').grab(FONT_ASSET_FRAGMENT).nullable(),
    woff: q('woff').grab(FONT_ASSET_FRAGMENT).nullable(),
    ttf: q('ttf').grab(FONT_ASSET_FRAGMENT).nullable(),
  }),
} satisfies Selection;
