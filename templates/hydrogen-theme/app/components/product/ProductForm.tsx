import type {
  ProductQuery,
  ProductVariantFragmentFragment,
} from 'storefrontapi.generated';

import {ShopPayButton, useProduct} from '@shopify/hydrogen-react';
import {cx} from 'class-variance-authority';
import {Button} from 'react-aria-components';

import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {useSelectedVariant} from '~/hooks/useSelectedVariant';

import {VariantSelector} from './VariantSelector';

export function ProductForm({
  variants,
}: {
  variants: ProductVariantFragmentFragment[];
}) {
  const {themeContent} = useSanityThemeContent();
  const {product} = useProduct() as {
    product: NonNullable<ProductQuery['product']>;
  };
  const selectedVariant = useSelectedVariant({variants});
  const isOutOfStock = !selectedVariant?.availableForSale;

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  return (
    <div className="grid gap-10">
      <div className="grid gap-4">
        <VariantSelector options={product.options} variants={variants} />
        {selectedVariant && (
          <div className="grid items-stretch gap-4">
            <Button
              className="inverted-color-scheme rounded px-3 py-2 disabled:opacity-50"
              isDisabled={isOutOfStock}
            >
              {isOutOfStock
                ? themeContent?.product?.soldOut
                : themeContent?.product?.addToCart}
            </Button>

            <div className="h-10">
              <ShopPayButton
                className={cx([
                  'h-full',
                  isOutOfStock &&
                    'pointer-events-none cursor-default opacity-50',
                ])}
                variantIds={[selectedVariant?.id!]}
                width="100%"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
