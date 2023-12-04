import type {Storefront} from '@shopify/hydrogen';
import type {InferType} from 'groqd';
import type {
  CollectionsQuery,
  FeaturedCollectionQuery,
} from 'storefrontapi.generated';

import {parseGid} from '@shopify/hydrogen';

import type {PAGE_QUERY} from '~/qroq/queries';

import {COLLECTIONS_QUERY, FEATURED_COLLECTION_QUERY} from '~/graphql/queries';

type SanityPageData = InferType<typeof PAGE_QUERY>;
type PromiseResolverArgs = {
  document: {data: SanityPageData};
  storefront: Storefront;
};

/**
 * Looks for promises in the sections of the given document.
 * For example if a page contains a **Featured Collection Section**, a promise to fetch the `collection` data is needed.
 * The promise will be resolved within the component.
 */
export function resolveShopifyPromises({
  document,
  storefront,
}: PromiseResolverArgs) {
  const featuredCollectionPromise = resolveFeaturedCollectionPromise({
    document,
    storefront,
  });

  const collectionListPromise = resolveCollectionListPromise({
    document,
    storefront,
  });

  return {collectionListPromise, featuredCollectionPromise};
}

function resolveFeaturedCollectionPromise({
  document,
  storefront,
}: PromiseResolverArgs) {
  const promises: Promise<FeaturedCollectionQuery>[] = [];

  document.data?.sections?.forEach((section) => {
    if (section._type === 'featuredCollectionSection') {
      const gid = section.collection?.store.gid;
      const first = section.maxProducts || 3;

      if (!gid) {
        return undefined;
      }

      const promise = storefront.query(FEATURED_COLLECTION_QUERY, {
        variables: {
          country: storefront.i18n.country,
          first,
          id: gid,
          language: storefront.i18n.language,
        },
      });

      promises.push(promise);
    }
  });

  const featuredCollectionPromise = Promise.all(promises);

  return featuredCollectionPromise;
}

function resolveCollectionListPromise({
  document,
  storefront,
}: PromiseResolverArgs) {
  const promises: Promise<CollectionsQuery>[] = [];

  document.data?.sections?.forEach((section) => {
    if (section._type === 'collectionListSection') {
      const first = section.collections?.length;
      const ids = section.collections?.map(
        (collection) => parseGid(collection.store.gid).id,
      );
      const query = ids?.map((id) => `(id:${id})`).join(' OR ');

      if (!ids?.length || !first) {
        return undefined;
      }

      const promise = storefront.query(COLLECTIONS_QUERY, {
        variables: {
          country: storefront.i18n.country,
          first,
          language: storefront.i18n.language,
          query,
        },
      });

      promises.push(promise);
    }
  });

  const collectionListPromise = Promise.all(promises);

  return collectionListPromise;
}
