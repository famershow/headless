import type { SelectedOption } from "@shopify/hydrogen/storefront-api-types";

import { useLocation } from "@remix-run/react";
import { useMemo } from "react";

export function useVariantUrl(
  handle: string,
  selectedOptions: SelectedOption[]
) {
  const { pathname } = useLocation();

  return useMemo(() => {
    return getVariantUrl({
      handle,
      pathname,
      searchParams: new URLSearchParams(),
      selectedOptions,
    });
  }, [handle, selectedOptions, pathname]);
}

export function getVariantUrl({
  handle,
  pathname,
  searchParams,
  selectedOptions,
}: {
  handle: string;
  pathname: string;
  searchParams: URLSearchParams;
  selectedOptions: SelectedOption[];
}) {
  const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
  const isLocalePathname = match && match.length > 0;

  const path = isLocalePathname
    ? `${match![0]}products/${handle}`
    : `/products/${handle}`;

  selectedOptions.forEach((option) => {
    searchParams.set(option.name, option.value);
  });

  const searchString = searchParams.toString();

  return path + (searchString ? "?" + searchParams.toString() : "");
}

/**
 * Validates that a url is local to the current request.
 */
export function isLocalPath(request: Request, url: string) {
  // Our domain, based on the current request path
  const currentUrl = new URL(request.url);

  // If url is relative, the 2nd argument will act as the base domain.
  const urlToCheck = new URL(url, currentUrl.origin);

  // If the origins don't match the slug is not on our domain.
  return currentUrl.origin === urlToCheck.origin;
}

/**
 * A not found response. Sets the status code.
 */
export const notFound = (message = "Not Found") =>
  new Response(message, {
    status: 404,
    statusText: "Not Found",
  });
