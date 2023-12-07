import {PortableText} from '@portabletext/react';

import type {ProductInformationSectionProps} from '../sections/ProductInformationSection';

import {AddToCartButtonBlock} from '../blocks/AddToCartButtonBlock';
import {ShopifyDescriptionBlock} from '../blocks/ShopifyDescriptionBlock';
import {ShopifyTitleBlock} from '../blocks/ShopifyTitleBlock';

export function ProductDetails(props: {data: ProductInformationSectionProps}) {
  return (
    <div className="space-y-4">
      {props.data.richtext && (
        <PortableText
          components={{
            types: {
              addToCartButton: ({value}) => {
                return <AddToCartButtonBlock {...value} />;
              },
              shopifyDescription: ({value}) => (
                <ShopifyDescriptionBlock {...value} />
              ),
              shopifyTitle: ({value}) => <ShopifyTitleBlock {...value} />,
            },
          }}
          value={props.data.richtext}
        />
      )}
    </div>
  );
}
