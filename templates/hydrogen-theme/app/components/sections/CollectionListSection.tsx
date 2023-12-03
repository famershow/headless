import type {TypeFromSelection} from 'groqd';
import {Suspense} from 'react';
import {Await, useLoaderData} from '@remix-run/react';

import type {COLLECTION_LIST_SECTION_FRAGMENT} from '~/qroq/sections';
import type {loader as indexLoader} from '../../routes/_index';
import type {SectionDefaultProps} from '~/lib/type';
import {CollectionListGrid} from '../CollectionListGrid';

type CollectionListSectionProps = TypeFromSelection<
  typeof COLLECTION_LIST_SECTION_FRAGMENT
>;

export function CollectionListSection(
  props: SectionDefaultProps & {data: CollectionListSectionProps},
) {
  const loaderData = useLoaderData<typeof indexLoader>();
  const collectionListPromise = loaderData?.collectionListPromise;
  const sectionGids = props.data.collections
    ?.map((collection) => collection.store.gid)
    .join(',');

  return collectionListPromise ? (
    <Suspense fallback={<div className="container">Loading...</div>}>
      <Await resolve={collectionListPromise}>
        {(data) => {
          // Resolve the collection list data from Shopify with the gids from Sanity
          const collections = data.find(({collections}) => {
            const gids = collections.nodes
              .map((collection) => collection.id)
              .join(',');
            return sectionGids === gids ? collections : null;
          })?.collections;

          return (
            <div className="container">
              <CollectionListGrid
                columns={props.data.desktopColumns}
                collections={collections}
              />
            </div>
          );
        }}
      </Await>
    </Suspense>
  ) : null;
}
