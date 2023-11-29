import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "@remix-run/react";

import { Logo } from "./Logo";
import { Navigation } from "../navigation/Navigation";
import { useSanityRoot } from "~/hooks/useSanityRoot";

export function Header() {
  const { data } = useSanityRoot();
  const header = data?.header;
  const paddingTop = header?.padding?.top || 0;
  const paddingBottom = header?.padding?.bottom || 0;
  const headerPadding = {
    top: `${paddingTop}px`,
    bottom: `${paddingBottom}px`,
  };
  const logoWidth = header?.desktopLogoWidth
    ? `${header?.desktopLogoWidth}px`
    : null;
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Todo: Set header height without JS
    const headerHeight = headerRef.current && headerRef.current.offsetHeight;

    setHeaderHeight(headerHeight ? headerHeight - paddingTop : 0);
  }, [paddingTop]);

  return (
    <header
      ref={headerRef}
      style={
        {
          paddingTop: headerPadding.top,
          paddingBottom: headerPadding.bottom,
          "--nav-height": `${headerHeight}px`,
        } as CSSProperties
      }
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Logo
              style={{
                width: logoWidth || undefined,
                height: "auto",
              }}
              sizes={logoWidth}
            />
          </Link>
          <Navigation data={header?.menu} />
        </div>
      </div>
    </header>
  );
}
