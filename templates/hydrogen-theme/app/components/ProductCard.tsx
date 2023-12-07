import type {ProductCardFragment} from 'storefrontapi.generated';

import {Link} from '@remix-run/react';
import {Image, Money, flattenConnection} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

export function ProductCard(props: {
  className?: string;
  columns?: null | number;
  product?: ProductCardFragment;
  skeleton?: {
    cardsNumber?: number;
  };
}) {
  const {columns, product, skeleton} = props;
  const firstVariant = product?.variants?.nodes.length
    ? flattenConnection(product?.variants)[0]
    : null;
  const sizes = cx([
    '(min-width: 1024px)',
    columns ? `${100 / columns}vw,` : '33vw,',
    '100vw',
  ]);

  return (
    <div className="overflow-hidden rounded-lg border">
      {!skeleton && product && firstVariant ? (
        <Link prefetch="intent" to={`/products/${product.handle}`}>
          {firstVariant?.image && (
            <Image
              aspectRatio="16/9"
              className="h-auto w-full object-cover"
              data={firstVariant.image}
              sizes={sizes}
            />
          )}
          <div className="p-3">
            <div className="text-lg">{product.title}</div>
            <div>
              <Money data={firstVariant.price} />
            </div>
          </div>
        </Link>
      ) : skeleton ? (
        <Skeleton />
      ) : null}
    </div>
  );
}

function Skeleton() {
  return (
    <>
      <div className="aspect-video w-full bg-slate-200" />
      <div className="p-3 text-black/0">
        <div className="text-lg">
          <span className="rounded bg-slate-100">Skeleton product title</span>
        </div>
        <div>
          <span className="rounded bg-slate-100">Skeleton price</span>
        </div>
      </div>
    </>
  );
}
