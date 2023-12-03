import type {CSSProperties} from 'react';
import {cx} from 'class-variance-authority';

import type {ProductCardFragment} from 'storefrontapi.generated';
import {ProductCard} from './ProductCard';

export function ProductCardGrid(props: {
  products: ProductCardFragment[];
  columns?: number | null;
}) {
  const {products} = props;
  const columnsVar = {
    '--columns': props.columns ?? 3,
  } as CSSProperties;

  return products.length > 0 ? (
    <ul
      style={columnsVar}
      className={cx([
        'grid gap-6',
        'lg:grid-cols-[repeat(var(--columns),_minmax(0,_1fr))]',
      ])}
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard columns={props.columns} product={product} />
        </li>
      ))}
    </ul>
  ) : null;
}
