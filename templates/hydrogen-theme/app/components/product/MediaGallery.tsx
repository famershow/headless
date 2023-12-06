import type {ProductQuery} from 'storefrontapi.generated';

import {MediaFile, flattenConnection} from '@shopify/hydrogen';

export function MediaGallery(props: {
  media: NonNullable<ProductQuery['product']>['media'];
}) {
  const medias = props.media ? flattenConnection(props.media) : [];

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
