import type { TypeFromSelection } from "groqd";
import { Link } from "@remix-run/react";
import { vercelStegaCleanAll } from "@sanity/client/stega";

import type { INTERNAL_LINK_FRAGMENT } from "~/qroq/links";
import { useLocale } from "~/hooks/useLocale";

type SanityInternalLinkProps = TypeFromSelection<typeof INTERNAL_LINK_FRAGMENT>;

export function SanityInternalLink(props: {
  data?: SanityInternalLinkProps;
  children?: React.ReactNode;
  className?: string;
}) {
  const locale = useLocale();
  const { data, children, className } = props;

  if (!data) return null;

  const { link, name } = data;

  const documentType = link?.documentType;
  const slug = link?.slug?.current;
  const anchor = data.anchor ? `#${data.anchor}` : "";

  const path: () => string = () => {
    switch (documentType) {
      case "page":
        return `${locale?.pathPrefix}/${slug}`;
      case "product":
        return `${locale?.pathPrefix}/products/${slug}`;
      case "collection":
        return `${locale?.pathPrefix}/collections/${slug}`;
      case "home":
        return locale?.pathPrefix || "/";
      case "blogPost":
        return `${locale?.pathPrefix}/blog/${slug}`;
      default:
        return "";
    }
  };

  // Remove encode stega data from url
  const url = vercelStegaCleanAll(`${path()}${anchor}`);

  // Todo: add Navlink support
  return (
    <Link prefetch="intent" to={url} className={className}>
      {children ? children : name}
    </Link>
  );
}
