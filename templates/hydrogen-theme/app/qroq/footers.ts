import type { Selection } from "groqd";
import { q, z } from "groqd";

import { COLOR_SCHEME_FRAGMENT } from "./fragments";

/*
|--------------------------------------------------------------------------
| Footer Settings
|--------------------------------------------------------------------------
*/
export const FOOTER_SETTINGS_FRAGMENT = q("settings").grab({
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
| Social Links Only
|--------------------------------------------------------------------------
*/
export const FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT = {
  _type: z.enum(["socialLinksOnly"]),
  _key: q.string().nullable(),
  settings: FOOTER_SETTINGS_FRAGMENT,
  copyright: [
    `coalesce(
      copyright[_key == $language][0].value,
      copyright[_key == $defaultLanguage][0].value,
    )`,
    q.string(),
  ],
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| List of footer
|--------------------------------------------------------------------------
*/
export const FOOTERS_LIST_SELECTION = {
  "_type == 'socialLinksOnly'": FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT,
};

/*
|--------------------------------------------------------------------------
| Footers Fragment
|--------------------------------------------------------------------------
*/
export const FOOTERS_FRAGMENT = q("footers[]", { isArray: true })
  .select(FOOTERS_LIST_SELECTION)
  .slice(0)
  .nullable();
