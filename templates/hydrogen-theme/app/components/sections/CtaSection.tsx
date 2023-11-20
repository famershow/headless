import type { SectionFragment } from "~/lib/type";
import type { CTA_SECTION_FRAGMENT } from "~/qroq/sections";

type CtaSectionProps = SectionFragment<typeof CTA_SECTION_FRAGMENT>;

export function CtaSection(props: { data: CtaSectionProps }) {
  const { data } = props;
  const { title } = data;

  return title ? (
    <div className="container flex justify-center">
      <h1>{title}</h1>
    </div>
  ) : null;
}
