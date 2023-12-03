import {Link} from '@remix-run/react';
import {flattenConnection, Image, Money} from '@shopify/hydrogen';

import type {ProductCardFragment} from 'storefrontapi.generated';

export function ProductCard(props: {
  product: ProductCardFragment;
  className?: string;
}) {
  const {product} = props;
  const firstVariant = flattenConnection(product.variants)[0];

  return (
    <div className="overflow-hidden rounded-lg border">
      <Link prefetch="viewport" to={`/products/${product.handle}`}>
        {firstVariant.image && (
          <Image aspectRatio="16/9" sizes="33vw" data={firstVariant.image} />
        )}
        <div className="p-3">
          <div className="text-lg">{product.title}</div>
          <div>
            <Money data={firstVariant.price} />
          </div>
        </div>
      </Link>
    </div>
  );
}
