import type {PortableTextTypeComponent} from '@portabletext/react';
import type {PortableTextBlock} from '@portabletext/types';
import type {InferType} from 'groqd';
import type {ProductQuery} from 'storefrontapi.generated';

import {PortableText} from '@portabletext/react';

import type {ProductInformationSectionProps} from '../sections/ProductInformationSection';

import {AddToCartButtonBlock} from '../blocks/AddToCartButtonBlock';
import {ShopifyDescriptionBlock} from '../blocks/ShopifyDescriptionBlock';
import {ShopifyTitleBlock} from '../blocks/ShopifyTitleBlock';

export function ProductDetails(props: {
  data: ProductInformationSectionProps;
  product: ProductQuery['product'];
}) {
  return (
    <div className="space-y-4">
      {props.data.richtext && (
        <PortableText
          components={{
            types: {
              addToCartButton: ({value}) => {
                return (
                  <AddToCartButtonBlock product={props.product} {...value} />
                );
              },
              shopifyDescription: ({value}) => (
                <ShopifyDescriptionBlock product={props.product} {...value} />
              ),
              shopifyTitle: ({value}) => (
                <ShopifyTitleBlock product={props.product} {...value} />
              ),
            },
          }}
          value={props.data.richtext}
        />
      )}
    </div>
  );
}
