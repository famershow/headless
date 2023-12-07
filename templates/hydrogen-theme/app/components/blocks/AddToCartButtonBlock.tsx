import type {InferType} from 'groqd';

import {Await, useLoaderData} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen-react';
import {Suspense} from 'react';

import type {ADD_TO_CART_BUTTON_BLOCK} from '~/qroq/blocks';
import type {loader} from '~/routes/($locale).products.$productHandle';

import {ProductForm} from '../product/ProductForm';

export function AddToCartButtonBlock(
  props: InferType<typeof ADD_TO_CART_BUTTON_BLOCK>,
) {
  const loaderData = useLoaderData<typeof loader>();
  const variantsPromise = loaderData.variants;

  return (
    <>
      {/* Todo => Add skeleton and errorElement */}
      <Suspense>
        <Await resolve={variantsPromise}>
          {({product}) => {
            const variants = product?.variants?.nodes.length
              ? flattenConnection(product.variants)
              : [];

            return <ProductForm variants={variants} {...props} />;
          }}
        </Await>
      </Suspense>
    </>
  );
}
