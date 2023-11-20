import { useRootLoaderData } from "./useRootLoaderData";

export function useEnvironmentVariables() {
  const data = useRootLoaderData();

  return data?.env;
}
