import {PortableText} from '@portabletext/react';
import {useMemo} from 'react';

import type {AddToCartButtonBlockProps} from '../blocks/AddToCartButtonBlock';
import type {PriceBlockProps} from '../blocks/PriceBlock';
import type {ShopifyDescriptionBlockProps} from '../blocks/ShopifyDescriptionBlock';
import type {ShopifyTitleBlockProps} from '../blocks/ShopifyTitleBlock';
import type {ProductInformationSectionProps} from '../sections/ProductInformationSection';

import {AddToCartButtonBlock} from '../blocks/AddToCartButtonBlock';
import {PriceBlock} from '../blocks/PriceBlock';
import {ShopifyDescriptionBlock} from '../blocks/ShopifyDescriptionBlock';
import {ShopifyTitleBlock} from '../blocks/ShopifyTitleBlock';

export function ProductDetails(props: {data: ProductInformationSectionProps}) {
  const components = useMemo(
    () => ({
      types: {
        addToCartButton: (props: {value: AddToCartButtonBlockProps}) => {
          return <AddToCartButtonBlock {...props.value} />;
        },
        price: (props: {value: PriceBlockProps}) => (
          <PriceBlock {...props.value} />
        ),
        shopifyDescription: (props: {value: ShopifyDescriptionBlockProps}) => (
          <ShopifyDescriptionBlock {...props.value} />
        ),
        shopifyTitle: (props: {value: ShopifyTitleBlockProps}) => (
          <ShopifyTitleBlock {...props.value} />
        ),
      },
    }),
    [],
  );

  return (
    <div className="space-y-4">
      {props.data.richtext && (
        <PortableText components={components} value={props.data.richtext} />
      )}
    </div>
  );
}
