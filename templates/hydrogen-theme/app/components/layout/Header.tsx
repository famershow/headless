import type { CSSProperties } from "react";
import { Link } from "@remix-run/react";

import { Logo } from "./Logo";
import { Navigation } from "../navigation/Navigation";
import { useSanityRoot } from "~/hooks/useSanityRoot";
import { useSettingsCssVars } from "~/hooks/useSettingsCssVars";
import { cx } from "class-variance-authority";

export function Header() {
  const { data } = useSanityRoot();
  const header = data?.header;
  const logoWidth = header?.desktopLogoWidth
    ? `${header?.desktopLogoWidth}px`
    : null;
  const cssVars = useSettingsCssVars({
    settings: header,
  });

  return (
    <header
      style={cssVars}
      className={cx([
        // Background and text color
        "bg-[var(--backgroundColor)] text-[var(--textColor)]",
        // Padding top and bottom, 25% smaller on mobile
        "pb-[calc(var(--paddingBottom)*.75)] pt-[calc(var(--paddingTop)*.75)]",
        "sm:pb-[var(--paddingBottom)] sm:pt-[var(--paddingTop)]",
      ])}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Logo
              className="h-auto w-[var(--logoWidth)]"
              sizes={logoWidth}
              style={
                {
                  "--logoWidth": logoWidth || "auto",
                } as CSSProperties
              }
            />
          </Link>
          <Navigation data={header?.menu} />
        </div>
      </div>
    </header>
  );
}
