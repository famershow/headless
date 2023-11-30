import {CSSProperties} from 'react';

export function Overlay(props: {opacity?: number | null}) {
  const style = {
    '--overlayOpacity': props?.opacity ? props.opacity / 100 : 0,
  } as CSSProperties;

  if (props?.opacity === 0) {
    return null;
  }

  return (
    <div
      aria-hidden
      style={style}
      className="absolute inset-0 bg-black bg-opacity-[var(--overlayOpacity)]"
    ></div>
  );
}
