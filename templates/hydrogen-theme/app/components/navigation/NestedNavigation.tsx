import type {TypeFromSelection} from 'groqd';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import {CaretDownIcon} from '@radix-ui/react-icons';

import type {NESTED_NAVIGATION_FRAGMENT} from '~/qroq/links';
import {NavigationTrigger} from './NestedNavigationTrigger';
import {SanityInternalLink} from '../sanity/link/SanityInternalLink';
import {SanityExternalLink} from '../sanity/link/SanityExternalLink';
import {NestedNavigationContent} from './NestedNavigationContent';
import {cx} from 'class-variance-authority';

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
          className="transition-transform duration-100 ease-in group-data-[state=open]:-rotate-180"
          aria-hidden
        />
      </NavigationTrigger>
      <NestedNavigationContent>
        <ul
          className={cx([
            'color-scheme',
            'relative z-10 flex w-auto min-w-[10rem] flex-col gap-1 rounded p-2 shadow',
          ])}
        >
          {childLinks.map((child) => (
            <NavigationMenu.Link key={child._key} asChild>
              <li
                className={cx([
                  'rounded px-2 py-1 transition-colors duration-100',
                  'hover:inverted-color-scheme',
                  '[&>*]:flex',
                ])}
              >
                {child._type === 'internalLink' ? (
                  <SanityInternalLink data={child} />
                ) : child._type === 'externalLink' ? (
                  <SanityExternalLink data={child} />
                ) : null}
              </li>
            </NavigationMenu.Link>
          ))}
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
