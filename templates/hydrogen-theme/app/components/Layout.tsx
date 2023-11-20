import { Suspense, lazy } from "react";
import { TailwindIndicator } from "./TailwindIndicator";

import { TogglePreviewMode } from "./sanity/TogglePreviewMode";
import { useSanityPreviewMode } from "~/hooks/useSanityPreviewMode";

const VisualEditing = lazy(() =>
  import("~/components/sanity/VisualEditing").then((mod) => ({
    default: mod.VisualEditing,
  }))
);

export type LayoutProps = {
  children?: React.ReactNode;
};

export function Layout({ children = null }: LayoutProps) {
  const previewMode = useSanityPreviewMode();

  return (
    <>
      <main>{children}</main>
      <TailwindIndicator />
      {previewMode ? (
        <Suspense>
          <VisualEditing />
        </Suspense>
      ) : (
        <TogglePreviewMode />
      )}
    </>
  );
}
