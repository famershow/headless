import { useEnvironmentVariables } from "./useEnvironmentVariables";
import { useIsDev } from "./useIsDev";
import { useIsInIframe } from "./useIsInIframe";

export function useSanityVisualEditing() {
  const isDev = useIsDev();
  const isInIframe = useIsInIframe();
  const env = useEnvironmentVariables();
  const useStega = env?.SANITY_STUDIO_USE_STEGA;

  if (!useStega)
    // Do not render VisualEditing if SANITY_STUDIO_USE_STEGA is not set
    return false;
  if (!isDev && !isInIframe)
    // Do not render VisualEditing outside of the studio in production
    return false;
  if (!isDev && isInIframe)
    // Render VisualEditing in production only when inside the studio
    return true;
  if (isDev)
    // Render VisualEditing if in development
    return true;

  return false;
}
