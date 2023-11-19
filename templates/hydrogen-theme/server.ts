// Virtual entry point for the app
import * as remixBuild from "@remix-run/dev/server-build";
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  storefrontRedirect,
} from "@shopify/hydrogen";
import {
  createRequestHandler,
  getStorefrontHeaders,
} from "@shopify/remix-oxygen";

import { getLocaleFromRequest } from "countries";
import { createSanityClient } from "./app/lib/sanity/sanity.server";
import { CART_QUERY_FRAGMENT } from "~/graphql/fragments";
import { envVariables } from "~/lib/env.server";
import { HydrogenSession } from "~/lib/hydrogen.session.server";
import { SanitySession } from "~/lib/sanity/sanity.session.server";

/*
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext
  ): Promise<Response> {
    try {
      /*
       * Open a cache instance in the worker and a custom session instance.
       */
      if (!env?.SESSION_SECRET) {
        throw new Error("SESSION_SECRET environment variable is not set");
      }

      const envVars = envVariables(env);
      const isDev = envVars.NODE_ENV === "development";
      const origin = new URL(request.url).origin;
      const locale = getLocaleFromRequest(request);
      const waitUntil = executionContext.waitUntil.bind(executionContext);
      const [cache, session, sanitySession] = await Promise.all([
        caches.open("hydrogen"),
        HydrogenSession.init(request, [env.SESSION_SECRET]),
        SanitySession.init(request, [env.SESSION_SECRET]),
      ]);
      const sanityPreviewMode = await sanitySession.has("previewMode");

      /*
       * Create Hydrogen's Storefront client.
       */
      const { storefront } = createStorefrontClient({
        cache,
        waitUntil,
        i18n: { language: locale.language, country: locale.country },
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION || "2023-10",
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request),
      });

      /*
       * Create a cart handler that will be used to
       * create and update the cart in the session.
       */
      const cart = createCartHandler({
        storefront,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault(),
        cartQueryFragment: CART_QUERY_FRAGMENT,
      });

      /*
       * Sanity CMS client
       */
      const sanity = createSanityClient({
        cache,
        waitUntil,
        sanityPreviewMode,
        config: {
          projectId: envVars.SANITY_STUDIO_PROJECT_ID,
          dataset: envVars.SANITY_STUDIO_DATASET,
          apiVersion: envVars.SANITY_STUDIO_API_VERSION,
          useCdn: envVars.NODE_ENV === "production",
          useStega: envVars.SANITY_STUDIO_USE_STEGA,
          studioUrl: envVars.SANITY_STUDIO_URL,
        },
      });

      /*
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({
          session,
          sanitySession,
          sanityPreviewMode,
          storefront,
          cart,
          env: envVars,
          waitUntil,
          sanity,
          locale,
          isDev,
        }),
      });

      const response = await handleRequest(request);

      if (response.status === 404) {
        /*
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({ request, response, storefront });
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return new Response("An unexpected error occurred", { status: 500 });
    }
  },
};
