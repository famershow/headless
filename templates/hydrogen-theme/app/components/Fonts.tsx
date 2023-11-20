import type { InferType } from "groqd";

import type { FONTS_QUERY } from "~/qroq/queries";
import type { FONT_CATEGORY_FRAGMENT } from "~/qroq/fragments";
import { useFonts } from "~/hooks/useFonts";

type FontsQuery = InferType<typeof FONTS_QUERY>;
type FontAssetsFragment = InferType<typeof FONT_CATEGORY_FRAGMENT.fontAssets>;

export function Fonts() {
  const fontData = useFonts();

  if (!fontData) {
    return null;
  }

  const fontFaces = generateFontFaces({ fontsData: fontData });
  const cssFontVariables = generateCssFontVariables({ fontsData: fontData });

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: fontFaces + "\n" + cssFontVariables,
      }}
    ></style>
  );
}

export function getFonts({ fontsData }: { fontsData: FontsQuery }) {
  const headingFonts =
    fontsData?.heading &&
    fontsData.heading.length > 0 &&
    fontsData.heading[0].fontAssets?.length > 0
      ? fontsData.heading[0].fontAssets
      : [];
  const bodyFonts =
    fontsData?.body &&
    fontsData.body?.length > 0 &&
    fontsData.body[0].fontAssets?.length > 0
      ? fontsData.body[0].fontAssets
      : [];
  const extraFonts =
    fontsData?.extra &&
    fontsData.extra?.length > 0 &&
    fontsData.extra[0]?.fontAssets?.length > 0
      ? fontsData.extra[0]?.fontAssets
      : [];

  return [...headingFonts, ...bodyFonts, ...extraFonts];
}

function generateFontFaces({ fontsData }: { fontsData: FontsQuery }) {
  const fonts = getFonts({ fontsData });

  if (fonts?.length > 0) {
    return fonts
      .map((font) => {
        return `
          @font-face {
            font-family: "${font.fontName}";
            src: ${resolveFontAssetUrls(font)};
            font-weight: ${font.fontWeight};
            font-style: ${font.fontStyle};
            font-display: swap;
          }
        `.trim();
      })
      .join("\n");
  }

  return "";
}

function resolveFontAssetUrls(font: FontAssetsFragment[0]) {
  const fontAssetUrls = [];

  font.woff2 && fontAssetUrls.push(`url("${font.woff2.url}") format("woff2")`);
  font.woff && fontAssetUrls.push(`url("${font.woff.url}") format("woff")`);
  font.ttf && fontAssetUrls.push(`url("${font.ttf.url}") format("truetype")`);

  return fontAssetUrls.join(", ");
}

function generateCssFontVariables({ fontsData }: { fontsData: FontsQuery }) {
  const fontCategories: Array<{
    categoryName: string;
    fontName: string;
    fontType: string;
    antialiased: boolean | null;
  }> = [];

  fontsData?.heading &&
    fontsData.heading?.length > 0 &&
    fontCategories.push({
      categoryName: "heading",
      ...fontsData.heading[0],
    });
  fontsData?.body &&
    fontsData.body?.length > 0 &&
    fontCategories.push({
      categoryName: "body",
      ...fontsData.body[0],
    });
  fontsData?.extra &&
    fontsData.extra?.length > 0 &&
    fontCategories.push({
      categoryName: "extra",
      ...fontsData.extra[0],
    });

  if (fontCategories?.length > 0) {
    return `
      :root {
        ${fontVariables()}
      }
    `.trim();
  }

  function fontVariables() {
    return fontCategories
      .map((fontCategory) => {
        return `
        --${fontCategory.categoryName}-font-family: "${fontCategory.fontName}";
        --${fontCategory.categoryName}-font-type: ${fontCategory.fontType};
        --${fontCategory.categoryName}-font-webkit-font-smoothing: ${
          fontCategory.antialiased ? "antialiased" : "unset"
        };
        --${fontCategory.categoryName}-font-moz-osx-font-smoothing: ${
          fontCategory.antialiased ? "grayscale" : "unset"
        };
        `.trim();
      })
      .join("\n");
  }

  return "";
}
