import { lazy } from "react";

export const sections: {
  [key: string]: React.FC<any>;
} = {
  heroSection: lazy(() =>
    import("../components/sections/HeroSection").then((module) => ({
      default: module.HeroSection,
    }))
  ),
  ctaSection: lazy(() =>
    import("../components/sections/CtaSection").then((module) => ({
      default: module.CtaSection,
    }))
  ),
};
