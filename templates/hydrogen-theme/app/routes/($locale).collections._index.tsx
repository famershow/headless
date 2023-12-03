import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';

import {COLLECTIONS_QUERY} from '~/graphql/queries';
import {CollectionListGrid} from '~/components/CollectionListGrid';

const PAGINATION_SIZE = 4;

export const loader = async ({
  request,
  context: {storefront},
}: LoaderFunctionArgs) => {
  const variables = getPaginationVariables(request, {
    pageBy: PAGINATION_SIZE,
  });
  const {collections} = await storefront.query(COLLECTIONS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  return json({collections});
};

export default function Collections() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="container py-20">
      <CollectionListGrid collections={data.collections} />
    </div>
  );
}
