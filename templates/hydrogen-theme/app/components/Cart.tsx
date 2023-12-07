import type {
  CartCost,
  CartLine,
  CartLineUpdateInput,
  Cart as CartType,
} from '@shopify/hydrogen/storefront-api-types';

import {Link} from '@remix-run/react';
import {
  CartForm,
  Image,
  Money,
  OptimisticInput,
  flattenConnection,
  parseGid,
  useOptimisticData,
} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {useRef} from 'react';
import {Button} from 'react-aria-components';

import {useLocalePath} from '~/hooks/useLocalePath';

import {IconRemove} from './icons/IconRemove';

type Layouts = 'drawer' | 'page';

export function Cart({
  cart,
  layout,
  onClose,
}: {
  cart: CartType | null;
  layout: Layouts;
  onClose?: () => void;
}) {
  const empty = Boolean(cart?.totalQuantity === 0);

  return (
    <>
      <CartEmpty hidden={!empty} layout={layout} onClose={onClose} />
      <CartDetails cart={cart} layout={layout} />
    </>
  );
}

export function CartDetails({
  cart,
  layout,
}: {
  cart: CartType | null;
  layout: Layouts;
}) {
  // @todo: get optimistic cart cost
  const cartHasItems = !!cart && cart.totalQuantity > 0;
  const container = {
    drawer: 'grid grid-cols-1 h-screen-no-nav grid-rows-[1fr_auto]',
    page: 'w-full pb-12 grid md:grid-cols-2 md:items-start gap-8 md:gap-8 lg:gap-12',
  };

  return (
    <div className={cx(['container', container[layout]])}>
      <CartLines layout={layout} lines={cart?.lines} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
    </div>
  );
}

/**
 * Temporary discount UI
 * @param discountCodes the current discount codes applied to the cart
 * @todo rework when a design is ready
 */
function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartType['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <>
      {/* Have existing discount, display it with a remove option */}
      <dl className={codes && codes.length !== 0 ? 'grid' : 'hidden'}>
        <div className="flex items-center justify-between font-medium">
          <span>Discount(s)</span>
          <div className="flex items-center justify-between">
            <UpdateDiscountForm>
              <button>
                <IconRemove
                  aria-hidden="true"
                  style={{height: 18, marginRight: 4}}
                />
              </button>
            </UpdateDiscountForm>
            <span>{codes?.join(', ')}</span>
          </div>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div
          className={cx('flex', 'text-copy items-center justify-between gap-4')}
        >
          <input name="discountCode" placeholder="Discount code" type="text" />
          <button className="flex justify-end whitespace-nowrap font-medium">
            Apply Discount
          </button>
        </div>
      </UpdateDiscountForm>
    </>
  );
}

function UpdateDiscountForm({
  children,
  discountCodes,
}: {
  children: React.ReactNode;
  discountCodes?: string[];
}) {
  return (
    <CartForm
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
      route="/cart"
    >
      {children}
    </CartForm>
  );
}

function CartLines({
  layout = 'drawer',
  lines: cartLines,
}: {
  layout: Layouts;
  lines: CartType['lines'] | undefined;
}) {
  const currentLines = cartLines ? flattenConnection(cartLines) : [];
  const scrollRef = useRef(null);

  const className = cx([
    layout === 'page'
      ? 'flex-grow md:translate-y-4'
      : 'px-6 pb-6 sm-max:pt-2 overflow-auto transition md:px-12',
  ]);

  return (
    <section
      aria-labelledby="cart-contents"
      className={className}
      ref={scrollRef}
    >
      <ul className="grid gap-6 md:gap-10">
        {currentLines.map((line) => (
          <CartLineItem key={line.id} line={line as CartLine} />
        ))}
      </ul>
    </section>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-2 flex flex-col">
      <a href={checkoutUrl} target="_self">
        Continue to Checkout
      </a>
      {/* @todo: <CartShopPayButton cart={cart} /> */}
    </div>
  );
}

function CartSummary({
  children = null,
  cost,
  layout,
}: {
  children?: React.ReactNode;
  cost: CartCost;
  layout: Layouts;
}) {
  const summary = {
    drawer: 'grid gap-4 p-6 border-t md:px-12',
    page: 'sticky top-nav grid gap-6 p-4 md:px-6 md:translate-y-4 bg-primary/5 rounded w-full',
  };

  return (
    <section aria-labelledby="summary-heading" className={summary[layout]}>
      <h2 className="sr-only" id="summary-heading">
        Order summary
      </h2>
      <dl className="grid">
        <div className="flex items-center justify-between font-medium">
          <span>Subtotal</span>
          <span>
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>
      </dl>
      {children}
    </section>
  );
}

type OptimisticData = {
  action?: string;
  quantity?: number;
};

function CartLineItem({line}: {line: CartLine}) {
  const optimisticData = useOptimisticData<OptimisticData>(line?.id);
  const {id, merchandise, quantity} = line;
  const variantId = parseGid(merchandise?.id)?.id;
  const productPath = useLocalePath({
    path: `/products/${merchandise.product.handle}?variant=${variantId}`,
  });

  if (!line?.id) return null;
  if (typeof quantity === 'undefined' || !merchandise?.product) return null;

  return (
    <li
      className={cx([
        // Hide the line item if the optimistic data action is remove
        // Do not remove the form from the DOM
        optimisticData?.action === 'remove' ? 'hidden' : 'flex',
        'gap-4',
      ])}
      key={id}
    >
      <div className="flex-shrink">
        {merchandise.image && (
          <Image
            alt={merchandise.title}
            className="h-24 w-24 rounded border object-cover object-center md:h-28 md:w-28"
            data={merchandise.image}
            height={110}
            sizes="110px"
            width={110}
          />
        )}
      </div>

      <div className="flex flex-grow justify-between">
        <div className="grid gap-2">
          <h3 className="text-2xl">
            {merchandise?.product?.handle ? (
              <Link to={productPath}>{merchandise?.product?.title || ''}</Link>
            ) : (
              <p>{merchandise?.product?.title || ''}</p>
            )}
          </h3>
          {merchandise?.selectedOptions.find(
            (option) => option.value !== 'Default Title',
          ) && (
            <div className="grid pb-2">
              {(merchandise?.selectedOptions || []).map((option) => (
                <span className="opacity-80" key={option.name}>
                  {option.name}: {option.value}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="text-copy flex justify-start">
              <CartLineQuantityAdjust line={line} />
            </div>
            <ItemRemoveButton lineId={id} />
          </div>
        </div>
        <span>
          <CartLinePrice as="span" line={line} />
        </span>
      </div>
    </li>
  );
}

function ItemRemoveButton({lineId}: {lineId: CartLine['id']}) {
  return (
    <CartForm
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{
        lineIds: [lineId],
      }}
      route="/cart"
    >
      <button
        className="flex h-10 w-10 items-center justify-center rounded border"
        type="submit"
      >
        <span className="sr-only">Remove</span>
        <IconRemove aria-hidden="true" />
      </button>
      <OptimisticInput data={{action: 'remove'}} id={lineId} />
    </CartForm>
  );
}

function CartLineQuantityAdjust({line}: {line: CartLine}) {
  const optimisticId = line?.id;
  const optimisticData = useOptimisticData<OptimisticData>(optimisticId);

  if (!line || typeof line?.quantity === 'undefined') return null;

  const optimisticQuantity = optimisticData?.quantity || line.quantity;

  const {id: lineId} = line;
  const prevQuantity = Number(Math.max(0, optimisticQuantity - 1).toFixed(0));
  const nextQuantity = Number((optimisticQuantity + 1).toFixed(0));

  return (
    <>
      <label className="sr-only" htmlFor={`quantity-${lineId}`}>
        Quantity, {optimisticQuantity}
      </label>
      <div className="flex items-center rounded border">
        <UpdateCartButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            className="text-primary/50 hover:text-primary disabled:text-primary/10 h-10 w-10 transition"
            disabled={optimisticQuantity <= 1}
            name="decrease-quantity"
            value={prevQuantity}
          >
            <span>&#8722;</span>
            <OptimisticInput
              data={{quantity: prevQuantity}}
              id={optimisticId}
            />
          </button>
        </UpdateCartButton>

        <div className="px-2 text-center" data-test="item-quantity">
          {optimisticQuantity}
        </div>

        <UpdateCartButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label="Increase quantity"
            className="text-primary/50 hover:text-primary h-10 w-10 transition"
            name="increase-quantity"
            value={nextQuantity}
          >
            <span>&#43;</span>
            <OptimisticInput
              data={{quantity: nextQuantity}}
              id={optimisticId}
            />
          </button>
        </UpdateCartButton>
      </div>
    </>
  );
}

function UpdateCartButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{
        lines,
      }}
      route="/cart"
    >
      {children}
    </CartForm>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  [key: string]: any;
  line: CartLine;
  priceType?: 'compareAt' | 'regular';
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />;
}

export function CartEmpty({
  hidden = false,
  layout = 'drawer',
  onClose,
}: {
  hidden: boolean;
  layout?: Layouts;
  onClose?: () => void;
}) {
  const container = {
    drawer: cx([
      'content-start gap-4 px-6 pb-8 transition overflow-y-scroll md:gap-12 md:px-12 h-screen-no-nav md:pb-12',
    ]),
    page: cx([
      hidden ? '' : 'grid',
      `container pb-12 w-full md:items-start gap-4 md:gap-8 lg:gap-12`,
    ]),
  };

  const collectionsPath = useLocalePath({path: '/collections'});
  const label = 'Continue shopping';

  return (
    <div className={container[layout]} hidden={hidden}>
      <section className="grid gap-6">
        <span>
          Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
          started!
        </span>
        <div>
          {layout === 'page' ? (
            <Link prefetch="intent" to={collectionsPath}>
              {label}
            </Link>
          ) : (
            <Button onPress={onClose}>{label}</Button>
          )}
        </div>
      </section>
      {/* Todo => add FeaturedProducts */}
      {/* <section className="grid gap-8 pt-16">
        <FeaturedProducts
          count={4}
          heading="Shop Best Sellers"
          layout={layout}
          onClose={onClose}
          sortKey="BEST_SELLING"
        />
      </section> */}
    </div>
  );
}
