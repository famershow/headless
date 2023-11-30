import type {TypeFromSelection} from 'groqd';

import type {HERO_SECTION_FRAGMENT} from '~/qroq/sections';

type HeroSectionProps = TypeFromSelection<typeof HERO_SECTION_FRAGMENT>;

export function HeroSection(props: {data: HeroSectionProps}) {
  const {data} = props;
  const {title} = data;

  return title ? (
    <div className="container flex justify-center">
      <h1>{title}</h1>
    </div>
  ) : null;
}
