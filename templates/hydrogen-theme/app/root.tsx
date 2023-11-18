import type { InferType } from "groqd";
import type { LoaderFunctionArgs, MetaFunction } from "@shopify/remix-oxygen";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import type { CustomerAccessToken } from "@shopify/hydrogen/storefront-api-types";
import { useNonce } from "@shopify/hydrogen";
import { defer } from "@shopify/remix-oxygen";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  LiveReload,
  useRouteError,
  useLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
} from "@remix-run/react";

import type { HydrogenSession } from "./lib/hydrogen.session.server";
import favicon from "../public/favicon.svg";
import appStyles from "./styles/app.css";
import tailwindCss from "./styles/tailwind.css";
import { Layout } from "~/components/Layout";
import { Fonts } from "./components/Fonts";
import { CMS_SETTINGS_QUERY } from "./qroq/queries";
import { generateFontsPreloadLinks } from "./lib/fonts";
import { useLocale } from "./hooks/useLocale";
import { Suspense, lazy } from "react";
import { useIsInIframe } from "./hooks/useIsInIframe";

const VisualEditing = lazy(() =>
  import("~/components/sanity/VisualEditing").then((mod) => ({
    default: mod.VisualEditing,
  }))
);

// This is important to avoid re-fetching root queries on sub-navigations
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== "GET") {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    {
      rel: "preconnect",
      href: "https://cdn.shopify.com",
    },
    {
      rel: "preconnect",
      href: "https://shop.app",
    },
    { rel: "stylesheet", href: tailwindCss },
    { rel: "stylesheet", href: appStyles },
    { rel: "icon", type: "image/svg+xml", href: favicon },
  ];
}

export const meta: MetaFunction<typeof loader> = (loaderData) => {
  const { data } = loaderData;
  // Preload fonts files to avoid FOUT (flash of unstyled text)
  const fontsPreloadLinks = generateFontsPreloadLinks({
    fontsData: data?.cms.initial.data?.fonts,
  });

  return [
    {
      tagName: "link",
      rel: "preconnect",
      // Preconnect to the Sanity CDN before loading fonts
      href: "https://cdn.sanity.io",
    },
    ...fontsPreloadLinks,
  ];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const { session, cart, env, sanity, locale } = context;
  const customerAccessToken = await session.get("customerAccessToken");

  const cmsSettings = await sanity.query({
    groqdQuery: CMS_SETTINGS_QUERY,
  });

  // validate the customer access token is valid
  const { isLoggedIn, headers } = await validateCustomerAccessToken(
    session,
    customerAccessToken
  );

  // defer the cart query by not awaiting it
  const cartPromise = cart.get();

  return defer(
    {
      locale,
      cms: {
        initial: cmsSettings,
        query: CMS_SETTINGS_QUERY.query,
        params: {},
      },
      query: CMS_SETTINGS_QUERY.query,
      params: {},
      // preview,
      cart: cartPromise,
      isLoggedIn,
      env: {
        /*
         * Be careful not to expose any sensitive environment variables here.
         */
        NODE_ENV: env.NODE_ENV,
        SANITY_STUDIO_URL: env.SANITY_STUDIO_URL,
        SANITY_STUDIO_USE_STEGA: env.SANITY_STUDIO_USE_STEGA,
        SANITY_STUDIO_PROJECT_ID: env.SANITY_STUDIO_PROJECT_ID,
        SANITY_STUDIO_DATASET: env.SANITY_STUDIO_DATASET,
        SANITY_STUDIO_API_VERSION: env.SANITY_STUDIO_API_VERSION,
      },
    },
    { headers }
  );
}

export default function App() {
  const nonce = useNonce();
  const { env } = useLoaderData<typeof loader>();
  const isInIframe = useIsInIframe();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Fonts />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col [&_main]:flex-1">
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration nonce={nonce} />
        {env.SANITY_STUDIO_USE_STEGA && isInIframe ? (
          <Suspense>
            <VisualEditing />
          </Suspense>
        ) : null}
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const nonce = useNonce();
  const routeError = useRouteError();
  const locale = useLocale();
  const isRouteError = isRouteErrorResponse(routeError);

  let title = "Error";
  let pageType = "page";

  if (isRouteError) {
    title = "Not found";
    if (routeError.status === 404) pageType = routeError.data || pageType;
  }

  return (
    <html lang={locale?.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <main>
          <section>
            <div className="container">
              <h1>{title}</h1>
            </div>
          </section>
        </main>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

/**
 * Validates the customer access token and returns a boolean and headers
 * @see https://shopify.dev/docs/api/storefront/latest/objects/CustomerAccessToken
 *
 * @example
 * ```js
 * const {isLoggedIn, headers} = await validateCustomerAccessToken(
 *  customerAccessToken,
 *  session,
 * );
 * ```
 */
async function validateCustomerAccessToken(
  session: HydrogenSession,
  customerAccessToken?: CustomerAccessToken
) {
  let isLoggedIn = false;
  const headers = new Headers();
  if (!customerAccessToken?.accessToken || !customerAccessToken?.expiresAt) {
    return { isLoggedIn, headers };
  }

  const expiresAt = new Date(customerAccessToken.expiresAt).getTime();
  const dateNow = Date.now();
  const customerAccessTokenExpired = expiresAt < dateNow;

  if (customerAccessTokenExpired) {
    session.unset("customerAccessToken");
    headers.append("Set-Cookie", await session.commit());
  } else {
    isLoggedIn = true;
  }

  return { isLoggedIn, headers };
}
