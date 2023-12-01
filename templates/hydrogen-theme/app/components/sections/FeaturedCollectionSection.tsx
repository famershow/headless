import type {TypeFromSelection} from 'groqd';
import {Suspense} from 'react';
import {Await, useLoaderData} from '@remix-run/react';

import type {FEATURED_COLLECTION_SECTION_FRAGMENT} from '~/qroq/sections';
import type {loader as indexLoader} from '../../routes/_index';
import {ProductCardGrid} from '../ProductCardGrid';
import {flattenConnection} from '@shopify/hydrogen';

type FeaturedCollectionSectionProps = TypeFromSelection<
  typeof FEATURED_COLLECTION_SECTION_FRAGMENT
>;

export function FeaturedCollectionSection(
  props: FeaturedCollectionSectionProps,
) {
  const loaderData = useLoaderData<typeof indexLoader>();
  const featuredCollectionPromise = loaderData?.featuredCollectionPromise;

  return featuredCollectionPromise ? (
    <Suspense fallback={<div className="container">Loading...</div>}>
      <Await resolve={featuredCollectionPromise}>
        {({collection}) => {
          const products =
            collection?.products?.nodes &&
            collection?.products?.nodes?.length > 1
              ? flattenConnection(collection?.products)
              : [];

          return collection ? (
            <div className="container">
              <h2>{collection.title}</h2>
              <div>
                <ProductCardGrid products={products} />
              </div>
            </div>
          ) : null;
        }}
      </Await>
    </Suspense>
  ) : null;
}
