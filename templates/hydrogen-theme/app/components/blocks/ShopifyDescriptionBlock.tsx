import type {InferType} from 'groqd';

import {useLoaderData} from '@remix-run/react';

import type {SHOPIFY_DESCRIPTION_BLOCK} from '~/qroq/blocks';
import type {loader} from '~/routes/($locale).products.$productHandle';

export type ShopifyDescriptionBlockProps = InferType<
  typeof SHOPIFY_DESCRIPTION_BLOCK
>;

export function ShopifyDescriptionBlock(props: ShopifyDescriptionBlockProps) {
  const {product} = useLoaderData<typeof loader>();

  return product ? (
    <div
      dangerouslySetInnerHTML={{
        __html: product.descriptionHtml,
      }}
    ></div>
  ) : null;
}
