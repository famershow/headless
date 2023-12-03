import {lazy} from 'react';

export const sections: {
  [key: string]: React.FC<any>;
} = {
  imageBannerSection: lazy(() =>
    import('../components/sections/ImageBannerSection').then((module) => ({
      default: module.ImageBannerSection,
    })),
  ),
  featuredCollectionSection: lazy(() =>
    import('../components/sections/FeaturedCollectionSection').then(
      (module) => ({
        default: module.FeaturedCollectionSection,
      }),
    ),
  ),
  collectionListSection: lazy(() =>
    import('../components/sections/CollectionListSection').then((module) => ({
      default: module.CollectionListSection,
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
