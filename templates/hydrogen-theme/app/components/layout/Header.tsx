import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "@remix-run/react";

import { Logo } from "./Logo";
import { useHeader } from "~/hooks/useHeader";
import { Navigation } from "../navigation/Navigation";

export function Header() {
  const header = useHeader();
  const headerPadding = {
    top: `${header?.paddingTop || 0}px`,
    bottom: `${header?.paddingBottom || 0}px`,
  };
  const logoWidth = header?.desktopLogoWidth
    ? `${header?.desktopLogoWidth}px`
    : null;
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Todo: Set header height without JS
    const headerHeight = headerRef.current && headerRef.current.offsetHeight;
    const padding = (header?.paddingTop || 0) + (header?.paddingBottom || 0);

    setHeaderHeight(headerHeight ? headerHeight - padding : 0);
  }, [header?.paddingBottom, header?.paddingTop]);

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
