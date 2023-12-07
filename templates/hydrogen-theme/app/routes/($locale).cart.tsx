import type {CartQueryData} from '@shopify/hydrogen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {Link, useLoaderData} from '@remix-run/react';
import {CartForm, Image, Money, flattenConnection} from '@shopify/hydrogen';
import {defer, json} from '@shopify/remix-oxygen';
import {cx} from 'class-variance-authority';
import {Link as ButtonLink} from 'react-aria-components';
import invariant from 'tiny-invariant';

import {useLocalePath} from '~/hooks/useLocalePath';
import {isLocalPath} from '~/lib/utils';

export async function action({context, request}: ActionFunctionArgs) {
  const {cart, session} = context;

  const [formData, customerAccessToken] = await Promise.all([
    request.formData(),
    session.get('customerAccessToken'),
  ]);

  const {action, inputs} = CartForm.getFormInput(formData);
  invariant(action, 'No cartAction defined');

  let status = 200;
  let result: CartQueryData;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate:
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    // Todo => Add support for updating buyer identity
    // case CartForm.ACTIONS.BuyerIdentityUpdate:
    //   result = await cart.updateBuyerIdentity({
    //     ...inputs.buyerIdentity,
    //     customerAccessToken,
    //   });
    //   break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(redirectTo)) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  const {cart: cartResult, errors} = result;
  return json(
    {
      analytics: {
        cartId,
      },
      cart: cartResult,
      errors,
    },
    {headers, status},
  );
}

export async function loader({context}: LoaderFunctionArgs) {
  const cart = await context.cart.get();

  return defer({cart});
}

export default function CartRoute() {
  const {cart} = useLoaderData<typeof loader>();
  const padding = cx('py-20');
  const lines = flattenConnection(cart?.lines);

  return (
    <div className={cx(['container', padding])}>
      <div className="flex justify-between gap-5">
        <ul className="grid gap-4">
          {lines.map((line) => (
            <LineItem key={line.id} line={line} />
          ))}
        </ul>
        <div>
          <div className="flex items-center gap-2">
            <span>Total</span>
            {cart?.cost.totalAmount && <Money data={cart.cost.totalAmount} />}
          </div>
          <div className="mt-4">
            <ButtonLink
              className="inverted-color-scheme"
              href={cart?.checkoutUrl}
            >
              {/* Todo => get text from sanity */}
              Proceed to checkout
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LineItem(props: {
  line: CartQueryData['cart']['lines']['nodes'][0];
}) {
  const {line} = props;
  const productPath = useLocalePath({
    path: `/products/${line.merchandise.product.handle}`,
  });

  return (
    <li key={line.id}>
      <div className="flex items-center gap-4">
        {line.merchandise.image && (
          <div className="aspect-square h-auto w-10">
            <Link prefetch="intent" to={productPath}>
              <Image
                className="h-full w-full rounded object-cover"
                data={line.merchandise.image}
                sizes="40px"
              />
            </Link>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span>
            {line.merchandise.product.title} x {line.quantity}
          </span>
          <span className="text-sm opacity-80">{line.merchandise.title}</span>
        </div>
      </div>
    </li>
  );
}
