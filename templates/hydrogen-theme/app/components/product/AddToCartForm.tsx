import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {ShopPayButton} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {useState} from 'react';
import {Button} from 'react-aria-components';

import {useIsInIframe} from '~/hooks/useIsInIframe';
import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';
import {useSelectedVariant} from '~/hooks/useSelectedVariant';

import {QuantitySelector} from './QuantitySelector';

export function AddToCartForm(props: {
  showQuantitySelector?: boolean | null;
  showShopPay?: boolean | null;
  variants: ProductVariantFragmentFragment[];
}) {
  const {showQuantitySelector, showShopPay, variants} = props;
  const {themeContent} = useSanityThemeContent();
  const isInIframe = useIsInIframe();
  const selectedVariant = useSelectedVariant({variants});
  const isOutOfStock = !selectedVariant?.availableForSale;
  const [quantity, setQuantity] = useState(1);

  return (
    selectedVariant && (
      <>
        {showQuantitySelector && (
          <QuantitySelector
            isOutOfStock={isOutOfStock}
            setQuantity={setQuantity}
          />
        )}
        <div className="grid gap-3">
          <div>
            <Button
              className="inverted-color-scheme w-full rounded px-3 py-2 disabled:opacity-50"
              isDisabled={isOutOfStock}
            >
              {isOutOfStock ? (
                <span>{themeContent?.product?.soldOut}</span>
              ) : (
                <span>{themeContent?.product?.addToCart}</span>
              )}
            </Button>
          </div>
          {!isInIframe && showShopPay && (
            <div className="h-10">
              <ShopPayButton
                className={cx([
                  'h-full',
                  isOutOfStock &&
                    'pointer-events-none cursor-default opacity-50',
                ])}
                variantIdsAndQuantities={[
                  {
                    id: selectedVariant?.id!,
                    quantity: quantity,
                  },
                ]}
                width="100%"
              />
            </div>
          )}
        </div>
      </>
    )
  );
}
