import {Link} from '@remix-run/react';
import {flattenConnection, Image, Money} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';
import {LazyMotion, m} from 'framer-motion';

import type {ProductCardFragment} from 'storefrontapi.generated';

export function ProductCard(props: {
  product?: ProductCardFragment;
  className?: string;
  columns?: number | null;
  skeleton?: {
    cardsNumber?: number;
  };
}) {
  const {product, columns, skeleton} = props;
  const firstVariant = product ? flattenConnection(product?.variants)[0] : null;
  const sizes = cx([
    '(min-width: 1024px)',
    columns ? `${100 / columns}vw,` : '33vw,',
    '100vw',
  ]);

  return (
    <div className="overflow-hidden rounded-lg border">
      {!skeleton && product && firstVariant ? (
        <Link prefetch="viewport" to={`/products/${product.handle}`}>
          {firstVariant?.image && (
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
      ) : skeleton ? (
        <Skeleton />
      ) : null}
    </div>
  );
}

function Skeleton() {
  const loadFeatures = async () =>
    await import('../lib/framerMotionFeatures').then((res) => res.default);
  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        animate={{opacity: [0.3, 1, 0.3]}}
        transition={{repeatType: 'loop', duration: 3, repeat: Infinity}}
        className="aspect-video w-full bg-slate-200"
      />
      <div className="p-3 text-black/0">
        <div className="text-lg">
          <span className="bg-slate-100">Skeleton product title</span>
        </div>
        <div>
          <span className="bg-slate-100">Skeleton price</span>
        </div>
      </div>
    </LazyMotion>
  );
}
