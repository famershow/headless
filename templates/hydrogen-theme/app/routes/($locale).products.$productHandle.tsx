import type {Storefront} from '@shopify/hydrogen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductQuery} from 'storefrontapi.generated';

import {useLoaderData} from '@remix-run/react';
import {getSelectedProductOptions} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {DEFAULT_LOCALE} from 'countries';
import invariant from 'tiny-invariant';

import {CmsSection} from '~/components/CmsSection';
import {
  PRODUCT_QUERY,
  RECOMMENDED_PRODUCTS_QUERY,
  VARIANTS_QUERY,
} from '~/graphql/queries';
import {useSanityData} from '~/hooks/useSanityData';
import {resolveShopifyPromises} from '~/lib/resolveShopifyPromises';
import {sanityPreviewPayload} from '~/lib/sanity/sanity.payload.server';
import {PRODUCT_QUERY as CMS_PRODUCT_QUERY} from '~/qroq/queries';

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {productHandle} = params;
  const {locale, sanity, storefront} = context;
  const language = locale?.language.toLowerCase();

  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    language,
    productHandle,
  };

  const productData = Promise.all([
    sanity.query({
      groqdQuery: CMS_PRODUCT_QUERY,
      params: queryParams,
    }),
    storefront.query<ProductQuery>(PRODUCT_QUERY, {
      variables: {
        country: context.storefront.i18n.country,
        handle: productHandle,
        language: context.storefront.i18n.language,
        selectedOptions,
      },
    }),
  ]);

  const [cmsProduct, {product}] = await productData;

  if (!product?.id || !cmsProduct) {
    throw new Response('product', {status: 404});
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deferred query resolves, the UI will update.
  const variants = context.storefront.query(VARIANTS_QUERY, {
    variables: {
      country: context.storefront.i18n.country,
      handle: productHandle,
      language: context.storefront.i18n.language,
    },
  });

  const recommended = getRecommendedProducts(context.storefront, product.id);

  const {
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
  } = resolveShopifyPromises({
    document: cmsProduct,
    storefront,
  });

  return defer({
    cmsProduct,
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
    product,
    recommended,
    variants,
    ...sanityPreviewPayload({
      context,
      params: queryParams,
      query: CMS_PRODUCT_QUERY.query,
    }),
  });
}

export default function Product() {
  const {cmsProduct} = useLoaderData<typeof loader>();
  const {data, encodeDataAttribute} = useSanityData(cmsProduct);

  // Todo => Add a template mechanism to CMS products so we can attach a same template to multiple products
  return data?.sections && data.sections.length > 0
    ? data.sections.map((section) => (
        <CmsSection
          data={section}
          encodeDataAttribute={encodeDataAttribute}
          key={section._key}
        />
      ))
    : null;
}

async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {count: 12, productId},
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
