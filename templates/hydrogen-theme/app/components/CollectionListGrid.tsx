import type {CSSProperties} from 'react';
import {flattenConnection} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import type {CollectionsQuery} from 'storefrontapi.generated';
import {CollectionCard} from './CollectionCard';

export function CollectionListGrid(props: {
  collections?: CollectionsQuery['collections'];
  columns?: number | null;
}) {
  const collections = flattenConnection(props.collections);
  const columnsVar = {
    '--columns': props.columns ?? 3,
  } as CSSProperties;

  return collections?.length > 0 ? (
    <ul
      style={columnsVar}
      className={cx([
        'grid gap-6',
        'lg:grid-cols-[repeat(var(--columns),_minmax(0,_1fr))]',
      ])}
    >
      {collections.map((collection) => (
        <li key={collection.id}>
          <CollectionCard columns={props.columns} collection={collection} />
        </li>
      ))}
    </ul>
  ) : null;
}
