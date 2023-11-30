import {getFonts} from '~/components/Fonts';

type PreloadLink = {
  tagName: string;
  rel: string;
  as: string;
  href: string;
  type: string;
  crossOrigin: string;
};

export function generateFontsPreloadLinks({fontsData}: {fontsData: any}) {
  const fonts = fontsData ? getFonts({fontsData}) : [];
  const preloadLinks: Array<PreloadLink> = [];
  const fontTypes = ['woff2', 'woff', 'ttf'];

  fonts.forEach((font: any) => {
    fontTypes.forEach((fontType) => {
      if (font[fontType]) {
        preloadLinks.push({
          tagName: 'link',
          rel: 'preload',
          as: 'font',
          href: font[fontType].url,
          type: `font/${fontType}`,
          crossOrigin: 'anonymous',
        });
      }
    });
  });

  return preloadLinks;
}
