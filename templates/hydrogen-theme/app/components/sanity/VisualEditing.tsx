import type { HistoryUpdate } from "@sanity/overlays";
import { useEffect, useRef } from "react";
import { useFetcher, useLocation, useNavigate } from "@remix-run/react";
import { enableOverlays } from "@sanity/overlays";
import { cx } from "class-variance-authority";

import { useEnvironmentVariables } from "~/hooks/useEnvironmentVariables";
import { useIsInIframe } from "~/hooks/useIsInIframe";
import { useSanityClient } from "~/hooks/useSanityClient";
import { useLiveMode } from "~/lib/sanity/sanity.loader";

export function VisualEditing() {
  const env = useEnvironmentVariables();
  const isInIframe = useIsInIframe();
  const navigateRemix = useNavigate();
  const location = useLocation();
  const navigateComposerRef = useRef<null | ((update: HistoryUpdate) => void)>(
    null
  );
  const sanityStudioUrl = env?.SANITY_STUDIO_URL!;
  const client = useSanityClient();

  useEffect(() => {
    if (!sanityStudioUrl) return;

    const disable = enableOverlays({
      allowStudioOrigin: sanityStudioUrl,
      zIndex: 999999,
      history: {
        subscribe: (navigate) => {
          navigateComposerRef.current = navigate;
          return () => {
            navigateComposerRef.current = null;
          };
        },
        update: (update) => {
          if (update.type === "push" || update.type === "replace") {
            navigateRemix(update.url, { replace: update.type === "replace" });
          } else if (update.type === "pop") {
            navigateRemix(-1);
          }
        },
      },
    });
    return () => disable();
  }, [navigateRemix, sanityStudioUrl]);

  useEffect(() => {
    if (navigateComposerRef.current) {
      navigateComposerRef.current({
        type: "push",
        url: `${location.pathname}${location.search}${location.hash}`,
      });
    }
  }, [location.hash, location.pathname, location.search]);

  // Enable live queries from the specified studio origin URL
  useLiveMode({ allowStudioOrigin: sanityStudioUrl, client });

  return !isInIframe ? <ExitBanner /> : null;
}

function ExitBanner() {
  const fetcher = useFetcher({ key: "exit-sanity-preview" });
  const location = useLocation();

  return (
    <section className="bg-gray-700 text-white">
      <div className="container py-6">
        <fetcher.Form action="/sanity/preview" method="POST">
          <input type="hidden" name="slug" value={location.pathname} />
          <div className="flex items-center justify-center gap-6">
            <small>Sanity Preview mode activated</small>
            <button
              type="submit"
              disabled={fetcher.state === "submitting"}
              className={cx(
                "flex h-[2.5rem] shrink-0 items-center justify-center rounded-full border border-white p-4 text-sm font-bold duration-200 ease-out",
                "hover:bg-white hover:text-gray-700",
                "disabled:bg-opacity-100 disabled:opacity-20"
              )}
            >
              Exit Preview Mode
            </button>
          </div>
        </fetcher.Form>
      </div>
    </section>
  );
}
