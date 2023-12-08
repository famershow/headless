import type {InferType} from 'groqd';
import type {ProductQuery} from 'storefrontapi.generated';

import {useProduct} from '@shopify/hydrogen-react';

import type {SHOPIFY_TITLE_BLOCK} from '~/qroq/blocks';

export type ShopifyTitleBlockProps = InferType<typeof SHOPIFY_TITLE_BLOCK>;

export function ShopifyTitleBlock(props: ShopifyTitleBlockProps) {
  const {product} = useProduct() as {product: ProductQuery['product']};

  return <h1>{product?.title}</h1>;
}
