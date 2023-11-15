import { useFetcher, useLocation } from "@remix-run/react";
import { cx } from "class-variance-authority";

import { useIsInIframe } from "~/hooks/useIsInIframe";

export function PreviewBanner() {
  const url = useLocation();
  const fetcher = useFetcher();
  const isInIframe = useIsInIframe();

  return !isInIframe ? (
    <fetcher.Form
      action={`/api/preview`}
      method="post"
      className={cx(
        "sticky bottom-0 z-40 flex items-center justify-center gap-4 px-4 py-2",
        "bg-black text-white",
        "md:px-8"
      )}
    >
      <input type="hidden" name="slug" value={url.pathname} />
      <small className="italic opacity-80">
        While preview mode is enabled, any changes made in the Studio will be
        streamed to your browser.
      </small>
      <button
        disabled={fetcher.state === "submitting"}
        className={cx(
          "bg-offBlack flex h-[2.5rem] shrink-0 items-center justify-center rounded-full border border-white border-opacity-20 p-4 text-sm font-bold duration-200 ease-out",
          "hover:bg-black",
          "disabled:bg-opacity-100 disabled:opacity-20"
        )}
      >
        Exit Preview Mode
      </button>
    </fetcher.Form>
  ) : null;
}
