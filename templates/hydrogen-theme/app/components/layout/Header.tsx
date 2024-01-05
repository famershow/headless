import {Await, Link} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {type CSSProperties, Suspense, useEffect} from 'react';

import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useRootLoaderData} from '~/hooks/useRootLoaderData';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {useSettingsCssVars} from '~/hooks/useSettingsCssVars';

import {Drawer, useDrawer} from '../Drawer';
import {Cart} from '../cart/Cart';
import {headerVariants} from '../cva/header';
import {Navigation} from '../navigation/Navigation';
import {CartCount} from './CartCount';
import {Logo} from './Logo';

export function Header() {
  const {
    closeDrawer: closeCart,
    isOpen: isCartOpen,
    openDrawer: openCart,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <DesktopHeader openCart={openCart} />
    </>
  );
}

function CartDrawer({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  const rootData = useRootLoaderData();

  return (
    <Drawer heading="Cart" onClose={onClose} open={isOpen} openFrom="right">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={rootData?.cart}>
          {(cart) => <Cart cart={cart} layout="drawer" onClose={onClose} />}
        </Await>
      </Suspense>
    </Drawer>
  );
}

function DesktopHeader(props: {openCart: () => void}) {
  const {data} = useSanityRoot();
  const header = data?.header;
  const logoWidth = header?.desktopLogoWidth
    ? `${header?.desktopLogoWidth}px`
    : null;
  const showSeparatorLine = header?.showSeparatorLine;
  const cssVars = useSettingsCssVars({
    settings: header,
  });
  return (
    <header
      className={cx([
        'color-scheme section-padding relative',
        headerVariants({
          optional: showSeparatorLine ? 'separator-line' : null,
        }),
      ])}
      style={cssVars}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <Link prefetch="intent" to="/">
            <Logo
              className="h-auto w-[var(--logoWidth)]"
              sizes={logoWidth}
              style={
                {
                  '--logoWidth': logoWidth || 'auto',
                } as CSSProperties
              }
            />
          </Link>
          <div className="flex items-center gap-3">
            <Navigation data={header?.menu} />
            <CartCount openCart={props.openCart} />
          </div>
        </div>
      </div>
    </header>
  );
}
