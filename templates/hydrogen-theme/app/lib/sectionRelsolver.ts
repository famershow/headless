import {lazy} from 'react';

export const sections: {
  [key: string]: React.FC<any>;
} = {
  imageBannerSection: lazy(() =>
    import('../components/sections/ImageBannerSection').then((module) => ({
      default: module.ImageBannerSection,
    })),
  ),
  ctaSection: lazy(() =>
    import('../components/sections/CtaSection').then((module) => ({
      default: module.CtaSection,
    })),
  ),
  socialLinksOnly: lazy(() =>
    import('../components/footers/SocialLinksOnly').then((module) => ({
      default: module.SocialLinksOnly,
    })),
  ),
};
