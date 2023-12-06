import type {InferType} from 'groqd';
import type {ProductQuery} from 'storefrontapi.generated';

import type {SHOPIFY_TITLE_BLOCK} from '~/qroq/blocks';

export function ShopifyTitleBlock(
  props: InferType<typeof SHOPIFY_TITLE_BLOCK> & {
    product: ProductQuery['product'];
  },
) {
  return <h1>{props.product?.title}</h1>;
}
