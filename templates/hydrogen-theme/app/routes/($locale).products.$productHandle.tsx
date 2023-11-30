import type {Storefront} from '@shopify/hydrogen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSelectedProductOptions} from '@shopify/hydrogen';
import {defer, redirect} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';

import type {ProductQuery} from 'storefrontapi.generated';
import {
  PRODUCT_QUERY,
  RECOMMENDED_PRODUCTS_QUERY,
  VARIANTS_QUERY,
} from '~/graphql/queries';
import {PRODUCT_QUERY as CMS_PRODUCT_QUERY} from '~/qroq/queries';
import {sanityPreviewPayload} from '~/lib/sanity/sanity.payload.server';
import {useSanityData} from '~/hooks/useSanityData';
import {DEFAULT_LOCALE} from 'countries';

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {productHandle} = params;
  const {storefront, sanity, locale} = context;
  const language = locale?.language.toLowerCase();

  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const queryParams = {
    productHandle,
    language,
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
  };

  const productData = Promise.all([
    sanity.query({
      groqdQuery: CMS_PRODUCT_QUERY,
      params: queryParams,
    }),
    storefront.query<ProductQuery>(PRODUCT_QUERY, {
      variables: {
        handle: productHandle,
        selectedOptions,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
  ]);

  const [cmsProduct, {product}] = await productData;

  if (!product?.id || !cmsProduct) {
    throw new Response('product', {status: 404});
  }

  if (!product.selectedVariant) {
    throw redirectToFirstVariant({product, request});
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deferred query resolves, the UI will update.
  const variants = context.storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: productHandle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  const recommended = getRecommendedProducts(context.storefront, product.id);

  // TODO: firstVariant is never used because we will always have a selectedVariant due to redirect
  // Investigate if we can avoid the redirect for product pages with no search params for first variant
  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  return defer({
    variants,
    product,
    cmsProduct,
    recommended,
    ...sanityPreviewPayload({
      query: CMS_PRODUCT_QUERY.query,
      params: queryParams,
      context,
    }),
  });
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductQuery['product'];
  request: Request;
}) {
  const searchParams = new URLSearchParams(new URL(request.url).search);
  const firstVariant = product!.variants.nodes[0];
  for (const option of firstVariant.selectedOptions) {
    searchParams.set(option.name, option.value);
  }

  return redirect(
    `/products/${product!.handle}?${searchParams.toString()}`,
    302,
  );
}

export default function Product() {
  const {product, cmsProduct} = useLoaderData<typeof loader>();
  const {data} = useSanityData(cmsProduct);

  return (
    <div className="container">
      <h1>{product.title}</h1>
    </div>
  );
}

async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
}
