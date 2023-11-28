import { Suspense, lazy } from "react";

import { TogglePreviewMode } from "../sanity/TogglePreviewMode";
import { useSanityPreviewMode } from "~/hooks/useSanityPreviewMode";
import { Link } from "@remix-run/react";
import { TailwindIndicator } from "../TailwindIndicator";
import { Header } from "./Header";

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
      <Header />
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
