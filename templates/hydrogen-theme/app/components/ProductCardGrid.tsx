import type {CSSProperties} from 'react';
import {cx} from 'class-variance-authority';

import type {ProductCardFragment} from 'storefrontapi.generated';
import {ProductCard} from './ProductCard';

export function ProductCardGrid(props: {
  products?: ProductCardFragment[];
  columns?: number | null;
  skeleton?: {
    cardsNumber?: number;
  };
}) {
  const {products, skeleton} = props;
  const columnsVar = {
    '--columns': props.columns ?? 3,
  } as CSSProperties;

  return (
    <ul
      style={columnsVar}
      className={cx([
        'grid gap-6',
        'lg:grid-cols-[repeat(var(--columns),_minmax(0,_1fr))]',
      ])}
    >
      {!skeleton && products && products.length > 0
        ? products.map((product) => (
            <li key={product.id}>
              <ProductCard columns={props.columns} product={product} />
            </li>
          ))
        : skeleton
          ? [...Array(skeleton.cardsNumber ?? 3)].map((_, i) => (
              <li key={i}>
                <ProductCard
                  skeleton={{
                    cardsNumber: skeleton.cardsNumber,
                  }}
                  columns={props.columns}
                />
              </li>
            ))
          : null}
    </ul>
  );
}
