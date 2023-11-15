import { useRootLoaderData } from "./useRootLoaderData";

export function useDefaultColorScheme() {
  const data = useRootLoaderData();
  const cmsSettings = data?.cmsSettings;

  return cmsSettings?.defaultColorScheme;
}
