import {Await, Link} from '@remix-run/react';
import {cx} from 'class-variance-authority';
import {Suspense, useMemo} from 'react';

import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useLocalePath} from '~/hooks/useLocalePath';
import {useRootLoaderData} from '~/hooks/useRootLoaderData';

import {IconBag} from '../icons/IconBag';

export function CartCount() {
  const rootData = useRootLoaderData();

  return (
    <Suspense fallback={<Badge count={0} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => <Badge count={cart?.totalQuantity || 0} />}
      </Await>
    </Suspense>
  );
}

function Badge(props: {count: number}) {
  const {count} = props;
  const isHydrated = useIsHydrated();
  const path = useLocalePath({path: '/cart'});

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag className="size-6" />
        {isHydrated && count > 0 && (
          <div
            className={cx([
              'absolute right-[-8px] top-0 flex items-center justify-center',
              'inverted-color-scheme',
              'aspect-square h-auto min-w-[1.35rem] rounded-full p-1',
              'text-center text-[.7rem] leading-[0] subpixel-antialiased',
            ])}
          >
            <span>{count}</span>
          </div>
        )}
      </>
    ),
    [count, isHydrated],
  );

  return (
    <Link
      className="focus:ring-primary/5 relative flex size-8 items-center justify-center"
      prefetch="intent"
      to={path}
    >
      {BadgeCounter}
    </Link>
  );
}
