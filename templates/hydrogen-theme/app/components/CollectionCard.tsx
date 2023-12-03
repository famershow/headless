import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import type {CollectionsQuery} from 'storefrontapi.generated';

export function CollectionCard(props: {
  collection: CollectionsQuery['collections']['nodes'][0];
  className?: string;
}) {
  const {collection} = props;

  return (
    <div className="overflow-hidden rounded-lg border">
      <Link to={`/collections/${collection.handle}`}>
        {collection.image && (
          <Image aspectRatio="16/9" sizes="33vw" data={collection.image} />
        )}
        <div className="p-3">
          <div className="text-lg">{collection.title}</div>
        </div>
      </Link>
    </div>
  );
}
