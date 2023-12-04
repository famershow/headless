import type {TypeFromSelection} from 'groqd';

import {Await, useLoaderData} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen';
import {Suspense} from 'react';

import type {SectionDefaultProps} from '~/lib/type';
import type {FEATURED_COLLECTION_SECTION_FRAGMENT} from '~/qroq/sections';

import type {loader as indexLoader} from '../../routes/_index';

import {ProductCardGrid} from '../ProductCardGrid';

type FeaturedCollectionSectionProps = TypeFromSelection<
  typeof FEATURED_COLLECTION_SECTION_FRAGMENT
>;

export function FeaturedCollectionSection(
  props: SectionDefaultProps & {data: FeaturedCollectionSectionProps},
) {
  const loaderData = useLoaderData<typeof indexLoader>();
  const featuredCollectionPromise = loaderData?.featuredCollectionPromise;
  const gid = props.data?.collection?.store.gid;

  return (
    <div className="container">
      <h2>{props.data.collection?.store.title}</h2>
      {featuredCollectionPromise ? (
        <Suspense
          fallback={
            <Skeleton
              cardsNumber={props.data.maxProducts || 3}
              columns={props.data.desktopColumns || 3}
            />
          }
        >
          <Await resolve={featuredCollectionPromise}>
            {(data) => {
              // Resolve the collection data from Shopify with the gid from Sanity
              const collection = data.find(
                ({collection}) => gid?.includes(collection?.id!),
              )?.collection;

              const products =
                collection?.products?.nodes &&
                collection?.products?.nodes?.length > 1
                  ? flattenConnection(collection?.products)
                  : [];

              return collection ? (
                <>
                  <ProductCardGrid
                    columns={props.data.desktopColumns}
                    products={products}
                  />
                </>
              ) : null;
            }}
          </Await>
        </Suspense>
      ) : null}
    </div>
  );
}

function Skeleton(props: {cardsNumber: number; columns: number}) {
  return (
    <div aria-hidden className="animate-pulse">
      <ProductCardGrid
        columns={props.columns}
        skeleton={{
          cardsNumber: props.cardsNumber,
        }}
      />
    </div>
  );
}
