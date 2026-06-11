"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth/config";
import { isPlatformAdmin, type OrgRole } from "@/lib/auth/permissions";
import { updateMarketingLeadStatus } from "@/lib/leads/persist";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/leads/types";

export async function updateLeadStatusAction(formData: FormData) {
  const session = await auth();
  const roles = ((session as { roles?: OrgRole[] }).roles ?? []) as OrgRole[];

  if (!session?.user || !isPlatformAdmin(roles)) {
    throw new Error("Unauthorized");
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as LeadStatus;

  if (!id || !LEAD_STATUSES.includes(status)) {
    throw new Error("Invalid lead update");
  }

  const updated = await updateMarketingLeadStatus(id, status);
  if (!updated) {
    throw new Error("Lead not found");
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}
