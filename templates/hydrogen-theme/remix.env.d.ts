/// <reference types="@remix-run/dev" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.

import type { Storefront, HydrogenCart } from "@shopify/hydrogen";
import type { CustomerAccessToken } from "@shopify/hydrogen/storefront-api-types";
import type { Sanity } from "./app/lib/sanity/sanity.server";

import type { HydrogenSession } from "./server";
import type { I18nLocale } from "~/lib/type";

import "@total-typescript/ts-reset";

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: { env: { NODE_ENV: "production" | "development" } };

  /**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {
    SESSION_SECRET: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_ID: string;
    PUBLIC_STOREFRONT_API_VERSION: string;
    PRIVATE_STOREFRONT_API_TOKEN: string;
    SANITY_STUDIO_PORT: string;
    SANITY_STUDIO_PROJECT_ID: string;
    SANITY_STUDIO_DATASET: string;
    SANITY_STUDIO_API_VERSION: string;
    SANITY_STUDIO_URL: string;
    SANITY_STUDIO_USE_STEGA: string;
    NODE_ENV: "production" | "development";
  }
}

declare module "@shopify/remix-oxygen" {
  /**
   * Declare local additions to the Remix loader context.
   */
  export interface AppLoadContext {
    env: Env;
    cart: HydrogenCart;
    storefront: Storefront;
    session: HydrogenSession;
    waitUntil: ExecutionContext["waitUntil"];
    sanity: Sanity;
    locale: I18nLocale;
    isDev: boolean;
  }

  /**
   * Declare the data we expect to access via `context.session`.
   */
  export interface SessionData {
    customerAccessToken: CustomerAccessToken;
  }
}
