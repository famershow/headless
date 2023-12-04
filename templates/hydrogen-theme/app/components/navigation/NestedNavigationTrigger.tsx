import type {TypeFromSelection} from 'groqd';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import type {INTERNAL_LINK_FRAGMENT} from '~/qroq/links';

import {SanityInternalLink} from '../sanity/link/SanityInternalLink';

export function NavigationTrigger(props: {
  children: React.ReactNode;
  link: TypeFromSelection<typeof INTERNAL_LINK_FRAGMENT>['link'];
}) {
  const {link} = props;
  const className = 'flex items-center gap-1';

  return (
    <NavigationMenu.Trigger asChild className="group">
      {link ? (
        <div>
          <SanityInternalLink
            className={className}
            data={{
              _key: null,
              _type: 'internalLink',
              anchor: null,
              link,
              name: null,
            }}
          >
            {props.children}
          </SanityInternalLink>
        </div>
      ) : (
        <button className={className}>{props.children}</button>
      )}
    </NavigationMenu.Trigger>
  );
}
