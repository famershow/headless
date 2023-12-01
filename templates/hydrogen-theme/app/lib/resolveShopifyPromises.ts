import type {Storefront} from '@shopify/hydrogen';
import type {InferType} from 'groqd';

import type {FeaturedCollectionQuery} from 'storefrontapi.generated';
import type {PAGE_QUERY} from '~/qroq/queries';
import {FEATURED_COLLECTION_QUERY} from '~/graphql/queries';

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

  return {featuredCollectionPromise};
}

function resolveFeaturedCollectionPromise({
  document,
  storefront,
}: PromiseResolverArgs) {
  let featuredCollectionPromise: Promise<FeaturedCollectionQuery> | undefined;

  document.data?.sections?.forEach((section) => {
    if (section._type === 'featuredCollectionSection') {
      const collectionHandle = section.collection?.store.slug.current;

      if (!collectionHandle) {
        return undefined;
      }

      const promise = storefront.query(FEATURED_COLLECTION_QUERY, {
        variables: {
          handle: collectionHandle,
          first: 4,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
      });

      featuredCollectionPromise = promise;
    }
  });

  return featuredCollectionPromise;
}
