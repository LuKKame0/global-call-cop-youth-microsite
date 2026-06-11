import { z } from "zod";

export const applyFormSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  organization: z.string().trim().min(1),
  role: z.string().trim().min(1),
  country: z.string().trim().min(1),
  intent: z.string().trim().min(1),
});

export const partnerFormSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  organization: z.string().trim().min(1),
  partnershipType: z.string().trim().min(1),
  message: z.string().trim().min(1),
});

export const coordinationFormSchema = z.object({
  name: z.string().trim().min(1),
  email: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? "")
    .refine((value) => value === "" || z.string().email().safeParse(value).success, {
      message: "Invalid email",
    }),
  organization: z.string().trim().min(1),
  role: z.string().trim().min(1),
  country: z.string().trim().min(1),
  intent: z.string().trim().min(1),
});

export const focalPointFormSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  linkedin: z.string().trim().min(1),
  age: z.coerce.number().int().min(16).max(120),
  country: z.string().trim().min(1),
  city: z.string().trim().min(1),
  hostZCop: z.enum(["yes", "no", "maybe"]),
  locale: z.string().trim().optional(),
});

export type ApplyFormPayload = z.infer<typeof applyFormSchema>;
export type PartnerFormPayload = z.infer<typeof partnerFormSchema>;
export type CoordinationFormPayload = z.infer<typeof coordinationFormSchema>;
export type FocalPointFormPayload = z.infer<typeof focalPointFormSchema>;
