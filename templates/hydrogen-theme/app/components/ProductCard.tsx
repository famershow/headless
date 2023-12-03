import {Link} from '@remix-run/react';
import {flattenConnection, Image, Money} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import type {ProductCardFragment} from 'storefrontapi.generated';

export function ProductCard(props: {
  product: ProductCardFragment;
  className?: string;
  columns?: number | null;
}) {
  const {product, columns} = props;
  const firstVariant = flattenConnection(product.variants)[0];
  const sizes = cx([
    '(min-width: 1024px)',
    columns ? `${100 / columns}vw,` : '33vw,',
    '100vw',
  ]);

  return (
    <div className="overflow-hidden rounded-lg border">
      <Link prefetch="viewport" to={`/products/${product.handle}`}>
        {firstVariant.image && (
          <Image
            className="h-auto w-full object-cover"
            aspectRatio="16/9"
            sizes={sizes}
            data={firstVariant.image}
          />
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
