import {getFonts} from '~/components/Fonts';

type PreloadLink = {
  as: string;
  crossOrigin: string;
  href: string;
  rel: string;
  tagName: string;
  type: string;
};

export function generateFontsPreloadLinks({fontsData}: {fontsData: any}) {
  const fonts = fontsData ? getFonts({fontsData}) : [];
  const preloadLinks: Array<PreloadLink> = [];
  const fontTypes = ['woff2', 'woff', 'ttf'];

  fonts.forEach((font: any) => {
    fontTypes.forEach((fontType) => {
      if (font[fontType]) {
        preloadLinks.push({
          as: 'font',
          crossOrigin: 'anonymous',
          href: font[fontType].url,
          rel: 'preload',
          tagName: 'link',
          type: `font/${fontType}`,
        });
      }
    });
  });

  return preloadLinks;
}
