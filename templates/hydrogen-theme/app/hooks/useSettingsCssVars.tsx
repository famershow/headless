import type { CSSProperties } from "react";
import type { InferType } from "groqd";

import type { SECTION_SETTINGS_FRAGMENT } from "~/qroq/sections";
import { useSanityRoot } from "./useSanityRoot";
import type { HEADER_QUERY } from "~/qroq/queries";

type CmsSectionSettings = InferType<typeof SECTION_SETTINGS_FRAGMENT>;
type HeaderQuery = InferType<typeof HEADER_QUERY>;

export function useSettingsCssVars({
  settings,
}: {
  settings?: CmsSectionSettings | HeaderQuery;
}): CSSProperties & {
  "--backgroundColor"?: string;
  "--textColor"?: string;
  "--paddingTop"?: string;
  "--paddingBottom"?: string;
} {
  const sanityRoot = useSanityRoot();
  const defaultColorScheme = sanityRoot?.data?.defaultColorScheme;
  // Color scheme
  const fallbackScheme = {
    background: { hex: "#ffffff" },
    text: { hex: "#000000" },
  };
  const colorScheme =
    settings?.colorScheme || defaultColorScheme || fallbackScheme;
  const scheme = {
    background: colorScheme?.background?.hex,
    text: colorScheme?.text?.hex,
  };

  // Padding
  const paddingTop = `${settings?.padding?.top}px` || "0px";
  const paddingBottom = `${settings?.padding?.bottom}px` || "0px";

  return {
    "--backgroundColor": scheme.background,
    "--textColor": scheme.text,
    "--paddingTop": paddingTop,
    "--paddingBottom": paddingBottom,
  };
}
