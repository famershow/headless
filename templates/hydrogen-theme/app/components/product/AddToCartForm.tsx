import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {CartForm, ShopPayButton} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {useState} from 'react';
import {Button} from 'react-aria-components';

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
        <CartForm
          action={CartForm.ACTIONS.LinesAdd}
          inputs={{
            lines: [
              {
                merchandiseId: selectedVariant?.id!,
                quantity,
              },
            ],
          }}
          route="/cart"
        >
          {(fetcher) => (
            <div className="grid gap-3">
              <Button
                className={cx([
                  'inverted-color-scheme w-full rounded px-3 py-2',
                  isOutOfStock && 'opacity-50',
                ])}
                isDisabled={isOutOfStock || fetcher.state !== 'idle'}
                type="submit"
              >
                {isOutOfStock ? (
                  <span>{themeContent?.product?.soldOut}</span>
                ) : (
                  <span>{themeContent?.product?.addToCart}</span>
                )}
              </Button>
              {showShopPay && (
                <div className="h-10">
                  <ShopPayButton
                    className={cx([
                      'h-full',
                      (fetcher.state !== 'idle' || isOutOfStock) &&
                        'pointer-events-none cursor-default',
                      isOutOfStock && 'opacity-50',
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
          )}
        </CartForm>
      </>
    )
  );
}
