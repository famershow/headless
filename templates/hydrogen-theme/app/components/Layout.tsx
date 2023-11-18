import { TailwindIndicator } from "./TailwindIndicator";
import { SanityStudioLink } from "./sanity/SanityStudioLink";

export type LayoutProps = {
  children?: React.ReactNode;
  sanityStudioPort?: string;
};

export function Layout({ children = null }: LayoutProps) {
  return (
    <>
      <main>{children}</main>
      <SanityStudioLink />
      <TailwindIndicator />
    </>
  );
}
