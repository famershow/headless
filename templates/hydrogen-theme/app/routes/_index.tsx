import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { defer } from "@shopify/remix-oxygen";
import PageRoute from "./($locale).$";
import { makeSafeQueryRunner } from "groqd";
import { PAGE_QUERY } from "~/qroq/queries";

export async function loader({ context }: LoaderFunctionArgs) {
  const { sanity, locale, isDev, storefront } = context;
  const language = locale?.language.toLowerCase();
  const cache = isDev ? storefront.CacheNone() : storefront.CacheShort();

  const runSanityQuery = makeSafeQueryRunner(
    (query, params: Record<string, unknown> = {}) =>
      sanity.query({ query, params, cache })
  );
  const cmsPage = await runSanityQuery(PAGE_QUERY, {
    handle: "home",
    language,
  });

  if (!cmsPage) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return defer({
    cmsPage,
  });
}

/*
 * Homepage route component is the same as the page route component
 * so we can just export the page route component as the homepage route component.
 * Homepage loader needs to return a cmsPage object.
 */
export default PageRoute;
