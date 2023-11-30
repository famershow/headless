import type {ProductCardFragment} from 'storefrontapi.generated';
import {ProductCard} from './ProductCard';

export function ProductCardGrid(props: {products: ProductCardFragment[]}) {
  const {products} = props;

  return products.length > 0 ? (
    <ul className="grid grid-cols-3 gap-10">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  ) : null;
}
