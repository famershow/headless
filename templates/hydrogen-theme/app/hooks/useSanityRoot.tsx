import {useRootLoaderData} from './useRootLoaderData';
import {useSanityData} from './useSanityData';

export function useSanityRoot() {
  const rootLoaderdata = useRootLoaderData();
  const sanityGlobal = rootLoaderdata?.sanityRoot!;
  const {data, loading, sourceMap, encodeDataAttribute} =
    useSanityData(sanityGlobal);

  return {data, loading, sourceMap, encodeDataAttribute};
}
