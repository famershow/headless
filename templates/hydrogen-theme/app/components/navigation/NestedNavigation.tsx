import type {TypeFromSelection} from 'groqd';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import {CaretDownIcon} from '@radix-ui/react-icons';

import type {NESTED_NAVIGATION_FRAGMENT} from '~/qroq/links';
import {NavigationTrigger} from './NestedNavigationTrigger';
import {SanityInternalLink} from '../sanity/link/SanityInternalLink';
import {SanityExternalLink} from '../sanity/link/SanityExternalLink';
import {NestedNavigationContent} from './NestedNavigationContent';

type SanityNestedNavigationProps = TypeFromSelection<
  typeof NESTED_NAVIGATION_FRAGMENT
>;

export function NestedNavigation(props: {data?: SanityNestedNavigationProps}) {
  const {data} = props;

  if (!data) return null;

  const {childLinks} = data;

  return data.name && childLinks && childLinks.length > 0 ? (
    <>
      <NavigationTrigger link={data.link}>
        {data.name}
        <CaretDownIcon
          className="transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
          aria-hidden
        />
      </NavigationTrigger>
      <NestedNavigationContent>
        <ul className="relative z-10 flex w-auto min-w-[10rem] flex-col gap-3 rounded bg-[var(--backgroundColor)] p-2 text-[var(--textColor)] shadow">
          {childLinks.map((child) =>
            child._type === 'internalLink' ? (
              <SanityInternalLink key={child._key} data={child} />
            ) : child._type === 'externalLink' ? (
              <SanityExternalLink key={child._key} data={child} />
            ) : null,
          )}
        </ul>
      </NestedNavigationContent>
    </>
  ) : data.link && data.name && (!childLinks || childLinks.length === 0) ? (
    // Render internal link if no child links
    <SanityInternalLink
      data={{
        _type: 'internalLink',
        _key: data._key,
        name: data.name,
        link: data.link,
        anchor: null,
      }}
    />
  ) : null;
}
