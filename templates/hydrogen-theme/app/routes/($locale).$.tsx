import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { useLoaderData, useLocation, useParams } from "@remix-run/react";
import { defer } from "@shopify/remix-oxygen";
import { Suspense } from "react";

import type { I18nLocale } from "~/lib/type";
import { CmsSection } from "~/components/CmsSection";
import { useLocale } from "~/hooks/useLocale";
import { makeSafeQueryRunner } from "groqd";
import { PAGE_QUERY } from "~/qroq/queries";
import { SanityPreview } from "hydrogen-sanity";

export async function loader({ context, params, request }: LoaderFunctionArgs) {
  const { sanity, locale, isDev, storefront } = context;
  const pathname = new URL(request.url).pathname;
  const handle = getPageHandle({ params, locale, pathname });
  const language = locale?.language.toLowerCase();
  const cache = isDev ? storefront.CacheNone() : storefront.CacheShort();

  const runSanityQuery = makeSafeQueryRunner(
    (query, params: Record<string, unknown> = {}) =>
      sanity.query({ query, params, cache })
  );
  const cmsPage = await runSanityQuery(PAGE_QUERY, { handle, language });

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

export default function PageRoute() {
  const { cmsPage } = useLoaderData<typeof loader>();
  const locale = useLocale();
  const params = useParams();
  const { pathname } = useLocation();
  const language = locale?.language.toLowerCase();
  const handle = locale && getPageHandle({ params, locale, pathname });

  return (
    <SanityPreview
      data={cmsPage}
      query={PAGE_QUERY.query}
      params={{ handle, language }}
    >
      {(page) => (
        <Suspense>
          {page?.sections && page?.sections?.length > 0
            ? page.sections.map((section) => (
                <CmsSection key={section._key} data={section} />
              ))
            : null}
        </Suspense>
      )}
    </SanityPreview>
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
