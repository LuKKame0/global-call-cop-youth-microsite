"use client";

import { createContext, useContext } from "react";

export interface TenantContext {
  orgId: string;
  orgSlug: string;
  orgName: string;
}

const Ctx = createContext<TenantContext | null>(null);

export const TenantProvider = Ctx.Provider;

export function useTenant(): TenantContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTenant must be used within a TenantProvider");
  return ctx;
}
