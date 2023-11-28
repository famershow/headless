import type { Selection } from "groqd";
import { q, z } from "groqd";

/*
|--------------------------------------------------------------------------
| Links Fragments
|--------------------------------------------------------------------------
*/
export const INTERNAL_LINK_FRAGMENT = {
  _type: z.enum(["internalLink"]),
  _key: q.string().nullable(),
  name: q.string().nullable(),
  anchor: q.string().nullable(),
  link: q("link")
    .deref()
    .grab({
      slug: [
        `coalesce(
            slug[_key == $language][0].value,
            slug[_key == $defaultLanguage][0].value,
            store.slug
          )`,
        q.object({
          current: q.string(),
          _type: q.string(),
        }),
      ],
      documentType: ["_type", q.string()],
    })
    .nullable(),
} satisfies Selection;

export const EXTERNAL_LINK_FRAGMENT = {
  _type: z.enum(["externalLink"]),
  _key: q.string().nullable(),
  link: q.string().nullable(),
  openInNewTab: q.boolean().nullable(),
  name: q.string().nullable(),
} satisfies Selection;

export const NESTED_NAVIGATION_FRAGMENT = {
  _type: z.enum(["nestedNavigation"]),
  _key: q.string().nullable(),
  childLinks: q("childLinks[]", { isArray: true }).select({
    '_type == "internalLink"': INTERNAL_LINK_FRAGMENT,
    '_type == "externalLink"': EXTERNAL_LINK_FRAGMENT,
  }),
  link: INTERNAL_LINK_FRAGMENT.link,
  name: INTERNAL_LINK_FRAGMENT.name,
} satisfies Selection;

/*
|--------------------------------------------------------------------------
| List of Links
|--------------------------------------------------------------------------
*/
export const LINKS_LIST_SELECTION = {
  '_type == "internalLink"': INTERNAL_LINK_FRAGMENT,
  '_type == "externalLink"': EXTERNAL_LINK_FRAGMENT,
  '_type == "nestedNavigation"': NESTED_NAVIGATION_FRAGMENT,
};
