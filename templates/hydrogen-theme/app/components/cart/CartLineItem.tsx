import type {
  CartLine,
  CartLineUpdateInput,
} from '@shopify/hydrogen/storefront-api-types';

import {Link} from '@remix-run/react';
import {
  CartForm,
  Image,
  Money,
  OptimisticInput,
  parseGid,
  useOptimisticData,
} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import {useLocalePath} from '~/hooks/useLocalePath';

import {
  QuantitySelector,
  QuantitySelectorButton,
  QuantitySelectorValue,
} from '../QuantitySelector';
import {IconRemove} from '../icons/IconRemove';

type OptimisticData = {
  action?: string;
  quantity?: number;
};

export function CartLineItem({line}: {line: CartLine}) {
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
            <div className="flex justify-start">
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
        {/* Todo => add theme content string */}
        <span className="sr-only">Remove</span>
        <IconRemove aria-hidden="true" />
      </button>
      <OptimisticInput data={{action: 'remove'}} id={lineId} />
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

function UpdateCartForm({
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
        {/* Todo => add theme content string */}
        Quantity, {optimisticQuantity}
      </label>
      <QuantitySelector>
        <UpdateCartForm lines={[{id: lineId, quantity: prevQuantity}]}>
          <QuantitySelectorButton
            disabled={optimisticQuantity <= 1}
            value={prevQuantity}
            variant="decrease"
          >
            <OptimisticInput
              data={{quantity: prevQuantity}}
              id={optimisticId}
            />
          </QuantitySelectorButton>
        </UpdateCartForm>
        <QuantitySelectorValue>{optimisticQuantity}</QuantitySelectorValue>
        <UpdateCartForm lines={[{id: lineId, quantity: nextQuantity}]}>
          <QuantitySelectorButton value={nextQuantity} variant="increase">
            <OptimisticInput
              data={{quantity: nextQuantity}}
              id={optimisticId}
            />
          </QuantitySelectorButton>
        </UpdateCartForm>
      </QuantitySelector>
    </>
  );
}
