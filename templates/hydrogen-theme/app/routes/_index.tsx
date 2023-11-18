import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { defer } from "@shopify/remix-oxygen";

import PageRoute from "./($locale).$";
import { PAGE_QUERY } from "~/qroq/queries";

export async function loader({ context }: LoaderFunctionArgs) {
  const { sanity, locale } = context;
  const language = locale?.language.toLowerCase();
  const queryParams = {
    handle: "home",
    language,
  };

  const cmsPage = await sanity.query({
    groqdQuery: PAGE_QUERY,
    params: queryParams,
  });

  if (!cmsPage.data) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return defer({
    cms: {
      initial: cmsPage,
      params: queryParams,
      query: PAGE_QUERY.query,
    },
  });
}

/*
 * Homepage route component is the same as the page route component
 * so we can just export the page route component as the homepage route component.
 * Homepage loader needs to return a cmsPage object.
 */
export default PageRoute;
