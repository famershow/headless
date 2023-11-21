import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { defer } from "@shopify/remix-oxygen";

import type { I18nLocale } from "~/lib/type";
import { CmsSection } from "~/components/CmsSection";
import { PAGE_QUERY } from "~/qroq/queries";
import { useLoaderData } from "@remix-run/react";
import { useSanityData } from "~/components/sanity/SanityData";
import { sanityPreviewPayload } from "~/lib/sanity/sanity.payload.server";

export async function loader({ context, params, request }: LoaderFunctionArgs) {
  const { sanity, locale } = context;
  const pathname = new URL(request.url).pathname;
  const handle = getPageHandle({ params, locale, pathname });
  const language = locale?.language.toLowerCase();

  const queryParams = {
    handle,
    language,
  };

  const page = await sanity.query({
    groqdQuery: PAGE_QUERY,
    params: queryParams,
  });

  if (!page.data) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return defer({
    page,
    ...sanityPreviewPayload({
      query: PAGE_QUERY.query,
      params: queryParams,
      context,
    }),
  });
}

export default function PageRoute() {
  const { page } = useLoaderData<typeof loader>();
  const { data } = useSanityData(page);

  return data?.sections && data.sections.length > 0
    ? data.sections.map((section) => (
        <CmsSection data={section} key={section._key} />
      ))
    : null;
}

function getPageHandle(args: {
  params: LoaderFunctionArgs["params"];
  locale: I18nLocale;
  pathname: string;
}) {
  const { params, locale, pathname } = args;
  const pathWithoutLocale = pathname.replace(`${locale?.pathPrefix}`, "");
  const pathWithoutSlash = pathWithoutLocale.replace(/^\/+/g, "");
  const isTranslatedHomePage =
    params.locale && locale.pathPrefix && !params["*"];

  // Return home as handle for a translated homepage ex: /fr/
  if (isTranslatedHomePage) return "home";

  const handle =
    locale?.pathPrefix && params["*"]
      ? params["*"] // Handle for a page with locale having pathPrefix ex: /fr/about-us/
      : params.locale && params["*"]
      ? `${params.locale}/${params["*"]}` // Handle for default locale page with multiple slugs ex: /about-us/another-slug
      : params.locale || pathWithoutSlash; // Handle for default locale page  ex: /about-us/

  return handle;
}
