import type {CSSProperties} from 'react';
import type {ProductCardFragment} from 'storefrontapi.generated';

import {cx} from 'class-variance-authority';

import {ProductCard} from './ProductCard';

export function ProductCardGrid(props: {
  columns?: null | number;
  products?: ProductCardFragment[];
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
      className={cx([
        'grid gap-6',
        'lg:grid-cols-[repeat(var(--columns),_minmax(0,_1fr))]',
      ])}
      style={columnsVar}
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
                  columns={props.columns}
                  skeleton={{
                    cardsNumber: skeleton.cardsNumber,
                  }}
                />
              </li>
            ))
          : null}
    </ul>
  );
}
