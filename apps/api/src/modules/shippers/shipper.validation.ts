import { z } from "zod";

const shipperSchema = z.object({
  contactPerson: z.string().trim().min(2),
  company: z.string().trim().min(2),
  contactPhone: z.string().trim().min(10).max(15).nullish(),
  contactEmail: z.email().nullish(),
});

export const createShipperSchema = shipperSchema.refine(
  (data) => data.contactPhone || data.contactEmail,
  "Provide a phone number or an email",
);

export const updateShipperSchema = shipperSchema.partial();

export const shipperIdParamSchema = z.object({
  shipperId: z.uuid(),
});

export type CreateShipperSchema = z.infer<typeof createShipperSchema>;
export type UpdateShipperSchema = z.infer<typeof updateShipperSchema>;
export type ShipperIdParamSchema = z.infer<typeof shipperIdParamSchema>;
