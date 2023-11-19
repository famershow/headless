import { createClient } from "@sanity/client/stega";

// Do not import this into client-side components unless lazy-loaded
export const getSanityClient = (args: {
  projectId: string;
  dataset: string;
  useStega: string;
  studioUrl: string;
  apiVersion: string;
  useCdn: boolean;
  sanityPreviewMode?: boolean;
}) => {
  const {
    projectId,
    dataset,
    useStega,
    studioUrl,
    apiVersion,
    useCdn,
    sanityPreviewMode,
  } = args;

  return {
    client: createClient({
      projectId,
      dataset,
      useCdn,
      apiVersion: apiVersion || "2023-10-01",
      stega: {
        enabled: sanityPreviewMode && useStega === "true" ? true : false,
        studioUrl,
      },
    }),
  };
};
