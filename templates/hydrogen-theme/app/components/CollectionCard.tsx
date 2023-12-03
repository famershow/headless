import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {cx} from 'class-variance-authority';

import type {CollectionsQuery} from 'storefrontapi.generated';

export function CollectionCard(props: {
  collection: CollectionsQuery['collections']['nodes'][0];
  className?: string;
  columns?: number | null;
}) {
  const {collection} = props;
  const sizes = cx([
    '(min-width: 1024px)',
    props.columns ? `${100 / props.columns}vw,` : '33vw,',
    '100vw',
  ]);

  return (
    <div className="overflow-hidden rounded-lg border">
      <Link prefetch="viewport" to={`/collections/${collection.handle}`}>
        {collection.image && (
          <Image
            aspectRatio="16/9"
            className="h-auto w-full object-cover"
            sizes={sizes}
            data={collection.image}
          />
        )}
        <div className="p-3">
          <div className="text-lg">{collection.title}</div>
        </div>
      </Link>
    </div>
  );
}
