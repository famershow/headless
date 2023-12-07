import type {ProductVariantFragmentFragment} from 'storefrontapi.generated';

import {Form, useFetchers, useSubmit} from '@remix-run/react';
import {CartForm, ShopPayButton} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {useCallback, useState} from 'react';
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
  const submit = useSubmit();
  const fetchers = useFetchers();

  const addToCartFetcher = fetchers.find(
    (fetcher) => fetcher.key === CartForm.ACTIONS.LinesAdd,
  );

  const loading =
    addToCartFetcher?.state === 'loading' ||
    addToCartFetcher?.state === 'submitting';

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      submit(formData, {
        action: '/cart',
        fetcherKey: CartForm.ACTIONS.LinesAdd,
        method: 'post',
        navigate: false,
        preventScrollReset: true,
      });
    },
    [submit],
  );

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
          <Form method="post" onSubmit={(e) => handleSubmit(e)}>
            <input
              name={CartForm.INPUT_NAME}
              type="hidden"
              value={JSON.stringify({
                action: CartForm.ACTIONS.LinesAdd,
                inputs: {
                  lines: {
                    merchandiseId: selectedVariant?.id!,
                    quantity,
                  },
                },
              })}
            />
            <Button
              className={cx([
                'inverted-color-scheme w-full rounded px-3 py-2',
                isOutOfStock && 'opacity-50',
              ])}
              isDisabled={isOutOfStock || loading}
              type="submit"
            >
              {isOutOfStock ? (
                <span>{themeContent?.product?.soldOut}</span>
              ) : (
                <span>{themeContent?.product?.addToCart}</span>
              )}
            </Button>
          </Form>
          {!isInIframe && showShopPay && (
            <div className="h-10">
              <ShopPayButton
                className={cx([
                  'h-full',
                  loading || isOutOfStock
                    ? 'pointer-events-none cursor-default'
                    : '',
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
      </>
    )
  );
}
