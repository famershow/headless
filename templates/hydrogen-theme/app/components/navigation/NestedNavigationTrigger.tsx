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
    <NavigationMenu.Trigger className="group" asChild>
      {link ? (
        <div>
          <SanityInternalLink
            className={className}
            data={{
              link,
              _type: 'internalLink',
              _key: null,
              anchor: null,
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
