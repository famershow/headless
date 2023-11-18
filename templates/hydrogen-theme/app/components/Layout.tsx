import { TailwindIndicator } from "./TailwindIndicator";

export type LayoutProps = {
  children?: React.ReactNode;
};

export function Layout({ children = null }: LayoutProps) {
  return (
    <>
      <main>{children}</main>
      <TailwindIndicator />
    </>
  );
}
