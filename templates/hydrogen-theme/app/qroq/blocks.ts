import {q, z} from 'groqd';

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
  size: z.enum(['small', 'medium', 'large']),
});
