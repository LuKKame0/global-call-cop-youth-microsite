import type { SVGProps } from "react";

const base = {
  width: 110,
  height: 110,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconSelf(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
    </svg>
  );
}

export function IconCommunity(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="8" cy="9" r="2.5" />
      <circle cx="16" cy="9" r="2.5" />
      <path d="M3 19c1-3 3-4.5 5-4.5s4 1.5 5 4.5" />
      <path d="M13 19c1-3 3-4.5 5-4.5s3.5 1.5 4 3.5" />
    </svg>
  );
}

export function IconInstitutions(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10 12 4l9 6" />
      <path d="M5 10v9" />
      <path d="M19 10v9" />
      <path d="M9 10v9" />
      <path d="M15 10v9" />
      <path d="M3 20h18" />
    </svg>
  );
}

export function IconSystems(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

export function IconArrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function IconSpark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="m6 6 2.5 2.5" />
      <path d="m15.5 15.5 2.5 2.5" />
      <path d="m6 18 2.5-2.5" />
      <path d="m15.5 8.5 2.5-2.5" />
    </svg>
  );
}

export function IconDoc(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

export function IconGlobe(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 3 4 6 4 9s-1.5 6-4 9c-2.5-3-4-6-4-9s1.5-6 4-9z" />
    </svg>
  );
}

const ICONS_BY_KEY: Record<string, (p: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  self: IconSelf,
  community: IconCommunity,
  institutions: IconInstitutions,
  systems: IconSystems,
};

/** Resolve a theme icon by content.ts key. Falls back to spark. */
export function ThemeIcon({ themeKey, ...rest }: { themeKey: string } & SVGProps<SVGSVGElement>) {
  const Cmp = ICONS_BY_KEY[themeKey] ?? IconSpark;
  return <Cmp {...rest} />;
}
