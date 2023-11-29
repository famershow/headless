import { useSanityRoot } from "~/hooks/useSanityRoot";
import { CmsSection } from "../CmsSection";

export function Footer() {
  const sanityRoot = useSanityRoot();
  const footerSections = sanityRoot.data?.footer?.sections;
  const footer = sanityRoot.data?.footer?.footer;

  return (
    <>
      {/* Sections */}
      {footerSections && footerSections.length > 0
        ? footerSections.map((section) => (
            <CmsSection data={section} key={section._key} />
          ))
        : null}
      {/* Footer Section */}
      {footer ? (
        <CmsSection type="footer" data={footer} key={footer._key} />
      ) : null}
    </>
  );
}
