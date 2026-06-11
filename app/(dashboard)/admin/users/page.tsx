import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export default async function AdminUsersPage() {
  const allUsers = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(200);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
        All Users
      </h1>

      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-secondary, #888)" }}>Name</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-secondary, #888)" }}>Email</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-secondary, #888)" }}>Verified</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--text-secondary, #888)" }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((u) => (
              <tr key={u.id} className="border-b border-white/5">
                <td className="px-4 py-3" style={{ color: "var(--text-primary)" }}>{u.name ?? "—"}</td>
                <td className="px-4 py-3" style={{ color: "var(--text-primary)" }}>{u.email}</td>
                <td className="px-4 py-3">
                  {u.emailVerified ? (
                    <span style={{ color: "var(--brand-green)" }}>✓</span>
                  ) : (
                    <span style={{ color: "var(--text-secondary, #888)" }}>—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--text-secondary, #888)" }}>
                  {u.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
