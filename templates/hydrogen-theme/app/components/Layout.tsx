import { usePreviewContext } from "hydrogen-sanity";

import { TailwindIndicator } from "./TailwindIndicator";
import { PreviewBanner } from "./sanity/PreviewBanner";
import { SanityStudioLink } from "./sanity/SanityStudioLink";

export type LayoutProps = {
  children?: React.ReactNode;
  sanityStudioPort?: string;
  env?: {
    SANITY_STUDIO_PROJECT_ID: string;
    SANITY_STUDIO_DATASET: string;
    SANITY_STUDIO_PORT: string;
  };
};

export function Layout({ children = null, env }: LayoutProps) {
  const port = env?.SANITY_STUDIO_PORT;
  const isPreview = Boolean(usePreviewContext());

  return (
    <>
      <main>{children}</main>
      <SanityStudioLink port={port} />
      <TailwindIndicator />
      {isPreview ? <PreviewBanner /> : <></>}
    </>
  );
}
