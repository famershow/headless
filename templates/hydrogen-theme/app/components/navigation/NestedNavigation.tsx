import type { TypeFromSelection } from "groqd";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { CaretDownIcon } from "@radix-ui/react-icons";

import type { NESTED_NAVIGATION_FRAGMENT } from "~/qroq/links";
import { NavigationTrigger } from "./NestedNavigationTrigger";
import { SanityInternalLink } from "../sanity/link/SanityInternalLink";
import { SanityExternalLink } from "../sanity/link/SanityExternalLink";

type SanityNestedNavigationProps = TypeFromSelection<
  typeof NESTED_NAVIGATION_FRAGMENT
>;

export function NestedNavigation(props: {
  data?: SanityNestedNavigationProps;
}) {
  const { data } = props;

  if (!data) return null;

  const { childLinks } = data;

  return data.name && childLinks && childLinks.length > 0 ? (
    <>
      <NavigationTrigger link={data.link}>
        {data.name}
        <CaretDownIcon
          className="transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
          aria-hidden
        />
      </NavigationTrigger>
      <NavigationMenu.Content className="absolute left-0 top-[var(--nav-height)] w-full">
        {/* Todo: use background from scheme */}
        <ul className="flex w-auto min-w-[10rem] flex-col gap-3 rounded bg-white p-2 shadow">
          {childLinks.map((child) =>
            child._type === "internalLink" ? (
              <SanityInternalLink key={child._key} data={child} />
            ) : child._type === "externalLink" ? (
              <SanityExternalLink key={child._key} data={child} />
            ) : null
          )}
        </ul>
      </NavigationMenu.Content>
    </>
  ) : data.link && data.name && (!childLinks || childLinks.length === 0) ? (
    // Render internal link if no child links
    <SanityInternalLink
      data={{
        _type: "internalLink",
        _key: data._key,
        name: data.name,
        link: data.link,
        anchor: null,
      }}
    />
  ) : null;
}
