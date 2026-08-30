import Link from "next/link";

import type { ReactNode } from "react";

export type CtaLink = {
  href: string;
  label: string;
  icon?: ReactNode;
};

export function CtaRow({ primary, secondary }: { primary: CtaLink; secondary?: CtaLink[] }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link href={primary.href} className="glass-button-primary">
        {primary.icon}
        {primary.label}
      </Link>
      {secondary?.map((item) => (
        <Link key={item.href + item.label} href={item.href} className="glass-button-secondary">
          {item.icon}
          {item.label}
        </Link>
      ))}
    </div>
  );
}
