const GLOW_STOPS: Record<"blue" | "green" | "pink" | "orange", string> = {
  blue: "rgba(55,171,250,0.08)",
  green: "rgba(97,200,121,0.07)",
  pink: "rgba(255,145,254,0.07)",
  orange: "rgba(255,70,13,0.06)",
};

export function PageGlow({ color = "blue" }: { color?: keyof typeof GLOW_STOPS }) {
  const stop = GLOW_STOPS[color];
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(circle at top left, ${stop}, transparent 32%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.03), transparent 24%)`,
      }}
    />
  );
}
