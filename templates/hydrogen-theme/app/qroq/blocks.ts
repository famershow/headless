import {q} from 'groqd';

/*
|--------------------------------------------------------------------------
| Product Custom Blocks
|--------------------------------------------------------------------------
*/
export const SHOPIFY_TITLE_BLOCK = q.object({
  _key: q.string(),
  _type: q.literal('shopifyTitle'),
});

export const SHOPIFY_DESCRIPTION_BLOCK = q.object({
  _key: q.string(),
  _type: q.literal('shopifyDescription'),
});

export const ADD_TO_CART_BUTTON_BLOCK = q.object({
  _key: q.string(),
  _type: q.literal('addToCartButton'),
  quantitySelector: q.boolean().nullable(),
  shopPayButton: q.boolean().nullable(),
});

export const PRICE_BLOCK = q.object({
  _key: q.string(),
  _type: q.literal('price'),
});
