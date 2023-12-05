import type {InferType} from 'groqd';
import type {ProductQuery} from 'storefrontapi.generated';

import type {SHOPIFY_DESCRIPTION_BLOCK} from '~/qroq/blocks';

export function ShopifyDescriptionBlock(
  props: InferType<typeof SHOPIFY_DESCRIPTION_BLOCK> & {
    product: ProductQuery['product'];
  },
) {
  return props.product ? (
    <div
      dangerouslySetInnerHTML={{
        __html: props.product.descriptionHtml,
      }}
    ></div>
  ) : null;
}
