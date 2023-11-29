import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useEffect, type CSSProperties, useMemo } from "react";
import { useSanityRoot } from "~/hooks/useSanityRoot";

export function NestedNavigationContent(props: { children: React.ReactNode }) {
  const sanityRoot = useSanityRoot();
  const headerLogoWidth = sanityRoot.data?.header?.desktopLogoWidth || 0;
  const headerPaddingTop = sanityRoot.data?.header?.padding?.top || 0;
  const assetLogoWidth = sanityRoot.data?.settings?.logo?.width || 0;
  const assetLogoHeight = sanityRoot.data?.settings?.logo?.height || 0;
  const logoAspectRatio = assetLogoWidth / assetLogoHeight;
  const logoHeight = headerLogoWidth / logoAspectRatio;
  const topDistance = useMemo(
    () => headerPaddingTop + logoHeight,
    [headerPaddingTop, logoHeight]
  );

  return (
    <NavigationMenu.Content
      style={
        {
          "--topDistance": `${topDistance}px`,
        } as CSSProperties
      }
      className="absolute left-0 top-[var(--topDistance)] w-full"
    >
      {props.children}
    </NavigationMenu.Content>
  );
}
