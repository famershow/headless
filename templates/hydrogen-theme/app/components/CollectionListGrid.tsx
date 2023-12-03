import type {CollectionsQuery} from 'storefrontapi.generated';
import {flattenConnection} from '@shopify/hydrogen';
import {CollectionCard} from './CollectionCard';

export function CollectionListGrid(props: {
  collections?: CollectionsQuery['collections'];
}) {
  const collections = flattenConnection(props.collections);

  return collections?.length > 0 ? (
    <ul className="grid grid-cols-3 gap-10">
      {collections.map((collection) => (
        <li key={collection.id}>
          <CollectionCard collection={collection} />
        </li>
      ))}
    </ul>
  ) : null;
}
