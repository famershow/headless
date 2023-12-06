import {useSanityRoot} from './useSanityRoot';

export function useSanityThemeContent() {
  const {data} = useSanityRoot();
  const themeContent = data?.themeContent;

  return {themeContent};
}
