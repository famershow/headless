import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import type { ProductCollectionSortKeys } from "@shopify/hydrogen/storefront-api-types";
import { useLoaderData } from "@remix-run/react";
import {
  flattenConnection,
  getPaginationVariables,
  Image,
} from "@shopify/hydrogen";
import { json } from "@shopify/remix-oxygen";
import invariant from "tiny-invariant";

import { ProductCardGrid } from "~/components/ProductCardGrid";
import { COLLECTION_QUERY } from "~/graphql/queries";

export type SortParam =
  | "price-low-high"
  | "price-high-low"
  | "best-selling"
  | "newest"
  | "featured";

export type AppliedFilter = {
  label: string;
  urlParam: {
    key: string;
    value: string;
  };
};

type VariantFilterParam = Record<string, string | boolean>;
type PriceFiltersQueryParam = Record<"price", { max?: number; min?: number }>;
type VariantOptionFiltersQueryParam = Record<
  "variantOption",
  { name: string; value: string }
>;
type FiltersQueryParams = Array<
  VariantFilterParam | PriceFiltersQueryParam | VariantOptionFiltersQueryParam
>;

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  const { collectionHandle } = params;

  invariant(collectionHandle, "Missing collectionHandle param");

  const searchParams = new URL(request.url).searchParams;
  const knownFilters = ["productVendor", "productType"];
  const available = "available";
  const variantOption = "variantOption";
  const { sortKey, reverse } = getSortValuesFromParam(
    searchParams.get("sort") as SortParam
  );
  const filters: FiltersQueryParams = [];
  const appliedFilters: AppliedFilter[] = [];

  for (const [key, value] of searchParams.entries()) {
    if (available === key) {
      filters.push({ available: value === "true" });
      appliedFilters.push({
        label: value === "true" ? "In stock" : "Out of stock",
        urlParam: {
          key: available,
          value,
        },
      });
    } else if (knownFilters.includes(key)) {
      filters.push({ [key]: value });
      appliedFilters.push({ label: value, urlParam: { key, value } });
    } else if (key.includes(variantOption)) {
      const [name, val] = value.split(":");
      filters.push({ variantOption: { name, value: val } });
      appliedFilters.push({ label: val, urlParam: { key, value } });
    }
  }

  // Builds min and max price filter since we can't stack them separately into
  // the filters array. See price filters limitations:
  // https://shopify.dev/custom-storefronts/products-collections/filter-products#limitations
  if (searchParams.has("minPrice") || searchParams.has("maxPrice")) {
    const price: { min?: number; max?: number } = {};
    if (searchParams.has("minPrice")) {
      price.min = Number(searchParams.get("minPrice")) || 0;
      appliedFilters.push({
        label: `Min: $${price.min}`,
        urlParam: { key: "minPrice", value: searchParams.get("minPrice")! },
      });
    }
    if (searchParams.has("maxPrice")) {
      price.max = Number(searchParams.get("maxPrice")) || 0;
      appliedFilters.push({
        label: `Max: $${price.max}`,
        urlParam: { key: "maxPrice", value: searchParams.get("maxPrice")! },
      });
    }
    filters.push({
      price,
    });
  }

  const { collection, collections } = await context.storefront.query(
    COLLECTION_QUERY,
    {
      variables: {
        ...paginationVariables,
        handle: collectionHandle,
        filters,
        sortKey,
        reverse,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }
  );

  if (!collection) {
    throw new Response("collection", { status: 404 });
  }

  return json({
    collection,
    appliedFilters,
    collections: flattenConnection(collections),
  });
}

export default function Collection() {
  const { collection } = useLoaderData<typeof loader>();
  const products =
    collection.products.nodes.length > 1
      ? flattenConnection(collection.products)
      : [];

  return (
    <>
      {collection.image && (
        <section>
          <div className="relative h-80 w-full overflow-hidden">
            <Image className="" data={collection.image} crop="center" />
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
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
} {
  switch (sortParam) {
    case "price-high-low":
      return {
        sortKey: "PRICE",
        reverse: true,
      };
    case "price-low-high":
      return {
        sortKey: "PRICE",
        reverse: false,
      };
    case "best-selling":
      return {
        sortKey: "BEST_SELLING",
        reverse: false,
      };
    case "newest":
      return {
        sortKey: "CREATED",
        reverse: true,
      };
    case "featured":
      return {
        sortKey: "MANUAL",
        reverse: false,
      };
    default:
      return {
        sortKey: "RELEVANCE",
        reverse: false,
      };
  }
}
