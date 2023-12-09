import type {
  Filter,
  ProductCollectionSortKeys,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductCardFragment} from 'storefrontapi.generated';

import {useLoaderData, useNavigate} from '@remix-run/react';
import {
  Image,
  Pagination,
  flattenConnection,
  getPaginationVariables,
} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';
import {useEffect} from 'react';
import invariant from 'tiny-invariant';

import type {SortParam} from '~/components/collection/SortFilter';

import {
  FILTER_URL_PREFIX,
  SortFilter,
} from '~/components/collection/SortFilter';
import {ProductCardGrid} from '~/components/product/ProductCardGrid';
import {COLLECTION_QUERY} from '~/graphql/queries';
import {parseAsCurrency} from '~/lib/utils';

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  const {collectionHandle} = params;
  const {locale, storefront} = context;

  invariant(collectionHandle, 'Missing collectionHandle param');

  const searchParams = new URL(request.url).searchParams;

  const {reverse, sortKey} = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );
  const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        filters.push({
          [filterKey]: JSON.parse(value),
        });
      }
      return filters;
    },
    [] as ProductFilter[],
  );

  const {collection, collections} = await storefront.query(COLLECTION_QUERY, {
    variables: {
      ...paginationVariables,
      country: storefront.i18n.country,
      filters,
      handle: collectionHandle,
      language: storefront.i18n.language,
      reverse,
      sortKey,
    },
  });

  if (!collection) {
    throw new Response('collection', {status: 404});
  }

  const allFilterValues = collection.products.filters.flatMap(
    (filter) => filter.values,
  );

  const appliedFilters = filters
    .map((filter) => {
      const foundValue = allFilterValues.find((value) => {
        const valueInput = JSON.parse(value.input as string) as ProductFilter;
        // special case for price, the user can enter something freeform (still a number, though)
        // that may not make sense for the locale/currency.
        // Basically just check if the price filter is applied at all.
        if (valueInput.price && filter.price) {
          return true;
        }
        return (
          // This comparison should be okay as long as we're not manipulating the input we
          // get from the API before using it as a URL param.
          JSON.stringify(valueInput) === JSON.stringify(filter)
        );
      });
      if (!foundValue) {
        // eslint-disable-next-line no-console
        console.error('Could not find filter value for filter', filter);
        return null;
      }

      if (foundValue.id === 'filter.v.price') {
        // Special case for price, we want to show the min and max values as the label.
        const input = JSON.parse(foundValue.input as string) as ProductFilter;
        const min = parseAsCurrency(input.price?.min ?? 0, locale);
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : '';
        const label = min && max ? `${min} - ${max}` : 'Price';

        return {
          filter,
          label,
        };
      }
      return {
        filter,
        label: foundValue.label,
      };
    })
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);

  return json({
    appliedFilters,
    collection,
    collections: flattenConnection(collections),
  });
}

export default function Collection() {
  const {appliedFilters, collection, collections} =
    useLoaderData<typeof loader>();
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
      <section className="container py-20">
        <SortFilter
          appliedFilters={appliedFilters}
          collections={collections}
          filters={collection.products.filters as Filter[]}
        >
          <Pagination connection={collection.products}>
            {({
              NextLink,
              PreviousLink,
              hasNextPage,
              isLoading,
              nextPageUrl,
              nodes,
              state,
            }) => (
              <>
                <div className="mb-6 flex items-center justify-center">
                  <PreviousLink>
                    {isLoading ? 'Loading...' : 'Load previous'}
                  </PreviousLink>
                </div>
                <ProductsLoadedOnScroll
                  hasNextPage={hasNextPage}
                  inView={true}
                  nextPageUrl={nextPageUrl}
                  nodes={nodes}
                  state={state}
                />
                <div className="mt-6 flex items-center justify-center">
                  <NextLink>
                    {isLoading ? 'Loading...' : 'Load more products'}
                  </NextLink>
                </div>
              </>
            )}
          </Pagination>
        </SortFilter>
      </section>
    </>
  );
}

function ProductsLoadedOnScroll({
  hasNextPage,
  inView,
  nextPageUrl,
  nodes,
  state,
}: {
  hasNextPage: boolean;
  inView: boolean;
  nextPageUrl: string;
  nodes: ProductCardFragment[];
  state: unknown;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (inView && hasNextPage) {
      navigate(nextPageUrl, {
        preventScrollReset: true,
        replace: true,
        state,
      });
    }
  }, [inView, navigate, state, nextPageUrl, hasNextPage]);

  return <ProductCardGrid products={nodes} />;
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
