import type {TypeFromSelection} from 'groqd';

import {useLoaderData} from '@remix-run/react';

import type {SectionDefaultProps} from '~/lib/type';
import type {PRODUCT_INFORMATION_SECTION_FRAGMENT} from '~/qroq/sections';
import type {loader} from '~/routes/($locale).products.$productHandle';

import {MediaGallery} from '../product/MediaGallery';
import {ProductDetails} from '../product/ProductDetails';

export type ProductInformationSectionProps = TypeFromSelection<
  typeof PRODUCT_INFORMATION_SECTION_FRAGMENT
>;

export function ProductInformationSection(
  props: SectionDefaultProps & {data: ProductInformationSectionProps},
) {
  const loaderData = useLoaderData<typeof loader>();
  const product = loaderData.product;
  const {data} = props;

  return (
    <div className="container">
      <div className="grid gap-10 lg:grid-cols-2">
        <MediaGallery media={product?.media} />
        <ProductDetails data={data} product={product} />
      </div>
    </div>
  );
}
