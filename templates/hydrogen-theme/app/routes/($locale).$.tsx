import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { useLoaderData } from "@remix-run/react";
import { defer } from "@shopify/remix-oxygen";
import { Suspense } from "react";

import type { I18nLocale } from "~/lib/type";
import { CmsSection } from "~/components/CmsSection";
import { PAGE_QUERY } from "~/qroq/queries";
import { useSanityQuery } from "~/hooks/useSanityQuery";

export async function loader({ context, params, request }: LoaderFunctionArgs) {
  const { sanity, locale } = context;
  const pathname = new URL(request.url).pathname;
  const handle = getPageHandle({ params, locale, pathname });
  const language = locale?.language.toLowerCase();

  const queryParams = {
    handle,
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

export default function PageRoute() {
  const { cms } = useLoaderData<typeof loader>();
  const { data, loading } = useSanityQuery(cms);

  // `data` should contain the initial data from the loader
  // `loading` will only be true when Visual Editing is enabled
  if (loading && !data) {
    return <div>Sanity Visual Editing is loading...</div>;
  }

  return (
    <Suspense>
      {data?.sections && data?.sections?.length > 0
        ? data.sections.map((section) => (
            <CmsSection key={section._key} data={section} />
          ))
        : null}
    </Suspense>
  );
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
