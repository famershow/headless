import type {CSSProperties} from 'react';
import {Link} from '@remix-run/react';

import {Logo} from './Logo';
import {Navigation} from '../navigation/Navigation';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {useSettingsCssVars} from '~/hooks/useSettingsCssVars';
import {section} from '../cva/section';

export function Header() {
  const {data} = useSanityRoot();
  const header = data?.header;
  const logoWidth = header?.desktopLogoWidth
    ? `${header?.desktopLogoWidth}px`
    : null;
  const showSeparatorLine = header?.showSeparatorLine;
  const cssVars = useSettingsCssVars({
    settings: header,
  });

  return (
    <header
      style={cssVars}
      className={section({optional: showSeparatorLine ? 'header' : null})}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <Link prefetch="intent" to="/">
            <Logo
              className="h-auto w-[var(--logoWidth)]"
              sizes={logoWidth}
              style={
                {
                  '--logoWidth': logoWidth || 'auto',
                } as CSSProperties
              }
            />
          </Link>
          <Navigation data={header?.menu} />
        </div>
      </div>
    </header>
  );
}
