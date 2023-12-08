import type {ProductCollectionSortKeys} from '@shopify/hydrogen/storefront-api-types';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {useLoaderData} from '@remix-run/react';
import {
  Image,
  flattenConnection,
  getPaginationVariables,
} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';

import {ProductCardGrid} from '~/components/product/ProductCardGrid';
import {COLLECTION_QUERY} from '~/graphql/queries';

export type SortParam =
  | 'best-selling'
  | 'featured'
  | 'newest'
  | 'price-high-low'
  | 'price-low-high';

export type AppliedFilter = {
  label: string;
  urlParam: {
    key: string;
    value: string;
  };
};

type VariantFilterParam = Record<string, boolean | string>;
type PriceFiltersQueryParam = Record<'price', {max?: number; min?: number}>;
type VariantOptionFiltersQueryParam = Record<
  'variantOption',
  {name: string; value: string}
>;
type FiltersQueryParams = Array<
  PriceFiltersQueryParam | VariantFilterParam | VariantOptionFiltersQueryParam
>;

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  const {collectionHandle} = params;

  invariant(collectionHandle, 'Missing collectionHandle param');

  const searchParams = new URL(request.url).searchParams;
  const knownFilters = ['productVendor', 'productType'];
  const available = 'available';
  const variantOption = 'variantOption';
  const {reverse, sortKey} = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );
  const filters: FiltersQueryParams = [];
  const appliedFilters: AppliedFilter[] = [];

  for (const [key, value] of searchParams.entries()) {
    if (available === key) {
      filters.push({available: value === 'true'});
      appliedFilters.push({
        label: value === 'true' ? 'In stock' : 'Out of stock',
        urlParam: {
          key: available,
          value,
        },
      });
    } else if (knownFilters.includes(key)) {
      filters.push({[key]: value});
      appliedFilters.push({label: value, urlParam: {key, value}});
    } else if (key.includes(variantOption)) {
      const [name, val] = value.split(':');
      filters.push({variantOption: {name, value: val}});
      appliedFilters.push({label: val, urlParam: {key, value}});
    }
  }

  // Builds min and max price filter since we can't stack them separately into
  // the filters array. See price filters limitations:
  // https://shopify.dev/custom-storefronts/products-collections/filter-products#limitations
  if (searchParams.has('minPrice') || searchParams.has('maxPrice')) {
    const price: {max?: number; min?: number} = {};
    if (searchParams.has('minPrice')) {
      price.min = Number(searchParams.get('minPrice')) || 0;
      appliedFilters.push({
        label: `Min: $${price.min}`,
        urlParam: {key: 'minPrice', value: searchParams.get('minPrice')!},
      });
    }
    if (searchParams.has('maxPrice')) {
      price.max = Number(searchParams.get('maxPrice')) || 0;
      appliedFilters.push({
        label: `Max: $${price.max}`,
        urlParam: {key: 'maxPrice', value: searchParams.get('maxPrice')!},
      });
    }
    filters.push({
      price,
    });
  }

  const {collection, collections} = await context.storefront.query(
    COLLECTION_QUERY,
    {
      variables: {
        ...paginationVariables,
        country: context.storefront.i18n.country,
        filters,
        handle: collectionHandle,
        language: context.storefront.i18n.language,
        reverse,
        sortKey,
      },
    },
  );

  if (!collection) {
    throw new Response('collection', {status: 404});
  }

  return json({
    appliedFilters,
    collection,
    collections: collections.edges.length ? flattenConnection(collections) : [],
  });
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const products = collection.products.nodes.length
    ? flattenConnection(collection.products)
    : [];

  return (
    <>
      {collection.image && (
        <section>
          <div className="relative h-80 w-full overflow-hidden">
            <Image
              crop="center"
              data={collection.image}
              loading="eager"
              sizes="100vw"
            />
            <div className="absolute inset-0">
              <div className="flex h-full items-center justify-center text-white">
                <h1>{collection.title}</h1>
              </div>
            </div>
          </div>
        </section>
      )}
      <section className="py-20">
        <div className="container">
          <ProductCardGrid products={products} />
        </div>
      </section>
    </>
  );
}

function getSortValuesFromParam(sortParam: SortParam | null): {
  reverse: boolean;
  sortKey: ProductCollectionSortKeys;
} {
  switch (sortParam) {
    case 'price-high-low':
      return {
        reverse: true,
        sortKey: 'PRICE',
      };
    case 'price-low-high':
      return {
        reverse: false,
        sortKey: 'PRICE',
      };
    case 'best-selling':
      return {
        reverse: false,
        sortKey: 'BEST_SELLING',
      };
    case 'newest':
      return {
        reverse: true,
        sortKey: 'CREATED',
      };
    case 'featured':
      return {
        reverse: false,
        sortKey: 'MANUAL',
      };
    default:
      return {
        reverse: false,
        sortKey: 'RELEVANCE',
      };
  }
}
