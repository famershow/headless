import { useRootLoaderData } from "./useRootLoaderData";

export function usePreview() {
  const data = useRootLoaderData();

  return data?.preview;
}
