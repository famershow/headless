import type { HistoryUpdate } from "@sanity/overlays";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import { enableOverlays } from "@sanity/overlays";

import { useEnvironmentVariables } from "~/hooks/useEnvironmentVariables";
import { getSanityClient } from "~/lib/sanity/client";
import { useLiveMode } from "~/lib/sanity/sanity.loader";

export function VisualEditing() {
  const env = useEnvironmentVariables();
  const navigateRemix = useNavigate();
  const location = useLocation();
  const navigateComposerRef = useRef<null | ((update: HistoryUpdate) => void)>(
    null
  );
  const sanityStudioUrl = env?.SANITY_STUDIO_URL!;
  const { client } = getSanityClient({
    projectId: env?.SANITY_STUDIO_PROJECT_ID!,
    dataset: env?.SANITY_STUDIO_DATASET!,
    studioUrl: sanityStudioUrl,
    useStega: env?.SANITY_STUDIO_USE_STEGA!,
    apiVersion: env?.SANITY_STUDIO_API_VERSION!,
    useCdn: env?.NODE_ENV === "production",
  });

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

  return null;
}
