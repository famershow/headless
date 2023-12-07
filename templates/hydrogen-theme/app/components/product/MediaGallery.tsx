import type {ProductQuery} from 'storefrontapi.generated';

import {MediaFile, flattenConnection} from '@shopify/hydrogen';
import {useProduct} from '@shopify/hydrogen-react';

export function MediaGallery() {
  const {product} = useProduct() as {product: ProductQuery['product']};

  const medias = product?.media?.nodes.length
    ? flattenConnection(product.media)
    : [];

  return (
    <ul className="grid">
      {medias.map((media) => {
        return (
          <li key={media.id}>
            <MediaFile
              className="rounded"
              data={media}
              mediaOptions={{
                image: {
                  sizes: '(min-width: 1024px) 50vw, 100vw',
                },
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}
