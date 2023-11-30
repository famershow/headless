import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import {
  flattenConnection,
  getPaginationVariables,
  Image,
} from '@shopify/hydrogen';

import type {CollectionsQuery} from 'storefrontapi.generated';
import {COLLECTIONS_QUERY} from '~/graphql/queries';

const PAGINATION_SIZE = 4;

type Collection = CollectionsQuery['collections']['nodes'][0];

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
      <CollectionCardGrid collections={data.collections} />
    </div>
  );
}

function CollectionCardGrid(props: {
  collections: CollectionsQuery['collections'];
}) {
  const collections =
    props.collections.nodes.length > 0
      ? flattenConnection(props.collections)
      : [];

  return collections.length > 0 ? (
    <ul className="grid grid-cols-3 gap-10">
      {collections.map((collection) => (
        <li key={collection.id}>
          <CollectionCard collection={collection} />
        </li>
      ))}
    </ul>
  ) : null;
}

function CollectionCard(props: {collection: Collection; className?: string}) {
  const {collection} = props;

  return (
    <div className="overflow-hidden rounded-lg border">
      <Link to={`/collections/${collection.handle}`}>
        {collection.image && <Image data={collection.image} />}
        <div className="p-3">
          <div className="text-lg">{collection.title}</div>
        </div>
      </Link>
    </div>
  );
}
