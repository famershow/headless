import type { InferType } from "groqd";

import type { SETTINGS_FRAGMENT } from "~/qroq/fragments";
import { SanityImage } from "../sanity/SanityImage";
import { useSettings } from "~/hooks/useSettings";

type Logo = InferType<typeof SETTINGS_FRAGMENT.logo>;

export function Logo(props: {
  sizes?: string | null;
  className?: string;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
}) {
  const cmsSettings = useSettings();
  const logo = cmsSettings?.logo;

  // Todo: add Sanity Visual editing data attributes
  return <SanityImage data={logo} {...props} />;
}
