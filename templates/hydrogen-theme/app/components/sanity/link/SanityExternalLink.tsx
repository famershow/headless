import type {TypeFromSelection} from 'groqd';
import type {EXTERNAL_LINK_FRAGMENT} from '~/qroq/links';

type SanityExternalLinkProps = TypeFromSelection<typeof EXTERNAL_LINK_FRAGMENT>;

export function SanityExternalLink(props: {
  data?: SanityExternalLinkProps;
  className?: string;
  children?: React.ReactNode;
}) {
  const {data, className, children} = props;

  if (!data) return null;

  const {name, link, openInNewTab} = data;

  return link ? (
    <a
      className={className}
      target={openInNewTab ? '_blank' : '_self'}
      href={link}
      rel="noopener noreferrer"
    >
      {children ? children : name}
    </a>
  ) : null;
}
