import type { ProductCardFragment } from "storefrontapi.generated";
import { ProductCard } from "./ProductCard";

export function ProductCardGrid(props: { products: ProductCardFragment[] }) {
  const { products } = props;

  return products.length > 0 ? (
    <ul className="grid grid-cols-3 gap-10">
      {products.map((product) =>
        checkSanityAvailability(product) ? (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ) : null
      )}
    </ul>
  ) : null;
}

/*
|--------------------------------------------------------------------------
| Check Sanity availability
|--------------------------------------------------------------------------
|
| To avoid synchronization issues between Sanity & Shopify, a metafield
| is required to be set to true in order for the product to be available
| in the storefront. A product needs to exists in Sanity and Shopify.
| The metafield should have a namespace of "sanity" and a key of "availability"
| and a value of type boolean (sanity.availability).
|
*/
export function checkSanityAvailability(product: ProductCardFragment) {
  const metafields = product.metafields;
  const isAvailable = metafields.find(
    (metafield) =>
      metafield?.namespace === "sanity" &&
      metafield?.key === "availability" &&
      metafield.value === "true"
  );

  return isAvailable;
}
