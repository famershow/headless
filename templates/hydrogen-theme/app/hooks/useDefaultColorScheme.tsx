import { useRootLoaderData } from "./useRootLoaderData";

export function useDefaultColorScheme() {
  const data = useRootLoaderData();
  const cmsSettings = data?.cms.initial.data;

  return cmsSettings?.defaultColorScheme;
}
