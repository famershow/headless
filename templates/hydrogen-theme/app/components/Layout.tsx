import { Suspense, lazy, useEffect, useState } from "react";
import { TailwindIndicator } from "./TailwindIndicator";

import { TogglePreviewMode } from "./sanity/TogglePreviewMode";
import { useSanityPreviewMode } from "~/hooks/useSanityPreviewMode";
import { Link } from "@remix-run/react";

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
      <header className="container">
        <nav className="flex gap-10">
          <Link to="/">Home</Link>
          <Link to="/fr">Home Fr</Link>
          <Link to="/our-team">Our team</Link>
          <Link to="/about-us">About</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/products/example-hat">Product Hat</Link>
        </nav>
      </header>
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
