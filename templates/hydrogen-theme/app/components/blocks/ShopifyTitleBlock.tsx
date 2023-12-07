import type {InferType} from 'groqd';
import type {ProductQuery} from 'storefrontapi.generated';

import {useProduct} from '@shopify/hydrogen-react';

import type {SHOPIFY_TITLE_BLOCK} from '~/qroq/blocks';

export function ShopifyTitleBlock(
  props: InferType<typeof SHOPIFY_TITLE_BLOCK>,
) {
  const {product} = useProduct() as {product: ProductQuery['product']};

  return <h1>{product?.title}</h1>;
}
