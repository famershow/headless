import type { SectionFragment } from "~/lib/type";
import type { HERO_SECTION_FRAGMENT } from "~/qroq/sections";

type HeroSectionProps = SectionFragment<typeof HERO_SECTION_FRAGMENT>;

export function HeroSection(props: { data: HeroSectionProps }) {
  const { data } = props;
  const { title } = data;

  return title ? (
    <div className="container flex justify-center">
      <h1>{title}</h1>
    </div>
  ) : null;
}
