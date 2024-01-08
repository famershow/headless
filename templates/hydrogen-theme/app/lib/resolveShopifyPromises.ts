import type {Storefront} from '@shopify/hydrogen';
import type {InferType} from 'groqd';
import type {
  CollectionsQuery,
  FeaturedCollectionQuery,
  FeaturedProductQuery,
} from 'storefrontapi.generated';

import {parseGid} from '@shopify/hydrogen';

import type {PAGE_QUERY, PRODUCT_QUERY} from '~/qroq/queries';

import {
  COLLECTIONS_QUERY,
  FEATURED_COLLECTION_QUERY,
  FEATURED_PRODUCT_QUERY,
  RECOMMENDED_PRODUCTS_QUERY,
} from '~/graphql/queries';

type SanityPageData = InferType<typeof PAGE_QUERY>;
type SanityProductData = InferType<typeof PRODUCT_QUERY>;
type PromiseResolverArgs = {
  document: {data: SanityPageData | SanityProductData};
  storefront: Storefront;
};

/**
 * Looks for promises in a list of sections of the given Sanity document.
 * For example if a Sanity page contains a **Featured Collection Section**, a promise to fetch
 * the `collection` data is needed. The promise will be resolved within the component.
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

  const featuredProductPromise = resolveFeaturedProductPromise({
    document,
    storefront,
  });

  const relatedProductsPromise = resolveRelatedProductsPromise({
    document,
    storefront,
  });

  return {
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
    relatedProductsPromise,
  };
}

function resolveFeaturedCollectionPromise({
  document,
  storefront,
}: PromiseResolverArgs) {
  const promises: Promise<FeaturedCollectionQuery>[] = [];

  for (const section of document.data?.sections || []) {
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
  }

  /**
   * Promise.allSettled is used to resolve all promises even if one of them fails.
   * This is useful when a page contains multiple sections that fetch data from Shopify.
   * If one of the promises fails, the page will still be rendered and only
   * the section that failed will be empty.
   */
  const featuredCollectionPromise = Promise.allSettled(promises);

  return featuredCollectionPromise;
}

function resolveCollectionListPromise({
  document,
  storefront,
}: PromiseResolverArgs) {
  const promises: Promise<CollectionsQuery>[] = [];

  for (const section of document.data?.sections || []) {
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
  }

  /**
   * Promise.allSettled is used to resolve all promises even if one of them fails.
   * This is useful when a page contains multiple sections that fetch data from Shopify.
   * If one of the promises fails, the page will still be rendered and only
   * the section that failed will be empty.
   */
  const collectionListPromise = Promise.allSettled(promises);

  return collectionListPromise;
}

function resolveFeaturedProductPromise({
  document,
  storefront,
}: PromiseResolverArgs) {
  const promises: Promise<FeaturedProductQuery>[] = [];

  for (const section of document.data?.sections || []) {
    if (section._type === 'featuredProductSection') {
      const gid = section.product?.store.gid;

      if (!gid) {
        return undefined;
      }

      const promise = storefront.query(FEATURED_PRODUCT_QUERY, {
        variables: {
          country: storefront.i18n.country,
          id: gid,
          language: storefront.i18n.language,
        },
      });

      promises.push(promise);
    }
  }

  /**
   * Promise.allSettled is used to resolve all promises even if one of them fails.
   * This is useful when a page contains multiple sections that fetch data from Shopify.
   * If one of the promises fails, the page will still be rendered and only
   * the section that failed will be empty.
   */
  const featuredProductPromise = Promise.allSettled(promises);

  return featuredProductPromise;
}

async function resolveRelatedProductsPromise({
  document,
  storefront,
}: PromiseResolverArgs) {
  let promise;

  if (document.data?._type !== 'product') {
    return null;
  }

  const productId = document.data?.store.gid;

  for (const section of document.data?.sections || []) {
    if (section._type === 'relatedProductsSection') {
      promise = storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
        variables: {
          count: section.maxProducts || 4,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
          productId,
        },
      });
    }
  }

  return promise || null;
}
