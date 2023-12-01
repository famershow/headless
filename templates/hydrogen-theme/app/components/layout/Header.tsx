import type {CSSProperties} from 'react';
import {Link} from '@remix-run/react';
import {cx} from 'class-variance-authority';

import {Logo} from './Logo';
import {Navigation} from '../navigation/Navigation';
import {useSanityRoot} from '~/hooks/useSanityRoot';
import {useSettingsCssVars} from '~/hooks/useSettingsCssVars';
import {headerVariants} from '../cva/header';

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
      className={cx([
        'color-scheme section-padding relative',
        headerVariants({
          optional: showSeparatorLine ? 'separator-line' : null,
        }),
      ])}
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
