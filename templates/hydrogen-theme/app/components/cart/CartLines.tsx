import type {
  CartLine,
  Cart as CartType,
} from '@shopify/hydrogen/storefront-api-types';

import {flattenConnection} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import type {CartLayouts} from './Cart';

import {CartLineItem} from './CartLineItem';

export function CartLines({
  layout = 'drawer',
  lines: cartLines,
}: {
  layout: CartLayouts;
  lines: CartType['lines'] | undefined;
}) {
  const currentLines = cartLines ? flattenConnection(cartLines) : [];

  const className = cx([
    layout === 'page'
      ? 'flex-grow md:translate-y-4'
      : 'px-6 pb-6 sm-max:pt-2 overflow-auto transition md:px-12',
  ]);

  return (
    <section aria-labelledby="cart-contents" className={className}>
      <ul className="grid gap-6 md:gap-10">
        {currentLines.map((line) => (
          <CartLineItem key={line.id} line={line as CartLine} />
        ))}
      </ul>
    </section>
  );
}
