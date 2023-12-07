import type {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';
import type {InferType} from 'groqd';
import type {
  ProductQuery,
  ProductVariantFragmentFragment,
} from 'storefrontapi.generated';
import type {PartialObjectDeep} from 'type-fest/source/partial-deep';

import {ShopPayButton, useProduct} from '@shopify/hydrogen-react';
import {cx} from 'class-variance-authority';
import {useState} from 'react';
import {Button} from 'react-aria-components';

import type {ADD_TO_CART_BUTTON_BLOCK} from '~/qroq/blocks';

import {AddToCartForm} from './AddToCartForm';
import {VariantSelector} from './VariantSelector';

export function ProductForm(
  props: {
    variants: ProductVariantFragmentFragment[];
  } & InferType<typeof ADD_TO_CART_BUTTON_BLOCK>,
) {
  const {product} = useProduct() as {
    product: NonNullable<ProductQuery['product']>;
  };
  const showQuantitySelector = props.quantitySelector;

  return (
    <div className="grid gap-4">
      <VariantSelector options={product.options} variants={props.variants} />
      <AddToCartForm
        showQuantitySelector={showQuantitySelector}
        showShopPay={props.shopPayButton}
        variants={props.variants}
      />
    </div>
  );
}
