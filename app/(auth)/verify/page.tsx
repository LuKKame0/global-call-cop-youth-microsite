export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--page-background)" }}>
      <div className="glass-panel w-full max-w-md p-8 text-center space-y-4">
        <div className="text-4xl">✉️</div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Check your email
        </h1>
        <p style={{ color: "var(--text-secondary, #888)" }}>
          A sign-in link has been sent to your email address. Open it on any device to confirm
          access.
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary, #666)" }}>
          Keep this browser open — it will sign you in automatically after you click the link.
        </p>
      </div>
    </div>
  );
}
