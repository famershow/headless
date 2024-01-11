import {lazy} from 'react';

export const sections: {
  [key: string]: React.FC<any>;
} = {
  carouselSection: lazy(() =>
    import('../components/sections/CarouselSection').then((module) => ({
      default: module.CarouselSection,
    })),
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
  featuredCollectionSection: lazy(() =>
    import('../components/sections/FeaturedCollectionSection').then(
      (module) => ({
        default: module.FeaturedCollectionSection,
      }),
    ),
  ),
  featuredProductSection: lazy(() =>
    import('../components/sections/FeaturedProductSection').then((module) => ({
      default: module.FeaturedProductSection,
    })),
  ),
  imageBannerSection: lazy(() =>
    import('../components/sections/ImageBannerSection').then((module) => ({
      default: module.ImageBannerSection,
    })),
  ),
  productInformationSection: lazy(() =>
    import('../components/sections/ProductInformationSection').then(
      (module) => ({
        default: module.ProductInformationSection,
      }),
    ),
  ),
  relatedProductsSection: lazy(() =>
    import('../components/sections/RelatedProductsSection').then((module) => ({
      default: module.RelatedProductsSection,
    })),
  ),
  richtextSection: lazy(() =>
    import('../components/sections/RichtextSection').then((module) => ({
      default: module.RichtextSection,
    })),
  ),
  socialLinksOnly: lazy(() =>
    import('../components/footers/SocialLinksOnly').then((module) => ({
      default: module.SocialLinksOnly,
    })),
  ),
};
