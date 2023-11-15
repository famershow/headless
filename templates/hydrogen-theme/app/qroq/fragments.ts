import { q } from "groqd";
import { SECTIONS_LIST_FRAGMENT } from "./sections";

/*
|--------------------------------------------------------------------------
| Color Fragments
|--------------------------------------------------------------------------
*/
export const COLOR_FRAGMENT = {
  hsl: q("hsl").grab({
    h: q.number(),
    s: q.number(),
    l: q.number(),
  }),
  rgb: q("rgb").grab({
    r: q.number(),
    g: q.number(),
    b: q.number(),
  }),
  hex: q.string(),
  alpha: q.number(),
};

export const COLOR_SCHEME_FRAGMENT = {
  background: q("background").grab(COLOR_FRAGMENT).nullable(),
  text: q("text").grab(COLOR_FRAGMENT).nullable(),
};

/*
|--------------------------------------------------------------------------
| Fonts Fragments
|--------------------------------------------------------------------------
*/
const FONT_ASSET_FRAGMENT = {
  url: q("asset").deref().grabOne("url", q.string()),
  extension: q("asset").deref().grabOne("extension", q.string()),
  mimeType: q("asset").deref().grabOne("mimeType", q.string()),
};

export const FONT_CATEGORY_FRAGMENT = {
  fontName: q.string(),
  fontType: q.string(),
  antialiased: q.boolean().nullable(),
  fontAssets: q("fontAssets[]", { isArray: true }).grab({
    fontWeight: q.number(),
    fontStyle: q.string(),
    fontName: ["^.fontName", q.string()],
    woff2: q("woff2").grab(FONT_ASSET_FRAGMENT).nullable(),
    woff: q("woff").grab(FONT_ASSET_FRAGMENT).nullable(),
    ttf: q("ttf").grab(FONT_ASSET_FRAGMENT).nullable(),
  }),
};

/*
|--------------------------------------------------------------------------
| Sections Fragments
|--------------------------------------------------------------------------
*/
export const SECTION_SETTINGS_FRAGMENT = q("settings").grab({
  paddingTop: q.number(),
  paddingBottom: q.number(),
  colorScheme: q("colorScheme").deref().grab(COLOR_SCHEME_FRAGMENT).nullable(),
  customCss: q
    .object({
      code: q.string().optional(),
    })
    .nullable(),
});

export const SECTIONS_FRAGMENT = q("sections[]", { isArray: true })
  .grab(
    {
      _type: q.string(),
      _key: q.string(),
      settings: SECTION_SETTINGS_FRAGMENT,
    },
    SECTIONS_LIST_FRAGMENT
  )
  .nullable();
