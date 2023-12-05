import type {InferType} from 'groqd';
import type {ProductQuery} from 'storefrontapi.generated';

import {Button} from 'react-aria-components';

import type {ADD_TO_CART_BUTTON_BLOCK} from '~/qroq/blocks';

import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';

export function AddToCartButtonBlock(
  props: InferType<typeof ADD_TO_CART_BUTTON_BLOCK> & {
    product: ProductQuery['product'];
  },
) {
  const {themeContent} = useSanityThemeContent();

  return (
    <Button className="inverted-color-scheme rounded px-3 py-2">
      {themeContent?.product?.addToCart}
    </Button>
  );
}
