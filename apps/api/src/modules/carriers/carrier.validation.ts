import { z } from "zod";

export const createCarrierSchema = z.object({
  mcNumber: z.string().trim().min(8),
  name: z.string().trim().min(2),
  contactPerson: z.string().trim().min(2),
  contactPhone: z.string().trim().min(10).max(15),
  contactEmail: z.email().nullish(),
});

export const updateCarrierSchema = createCarrierSchema.partial();

export const carrierIdParamSchema = z.object({
  carrierId: z.uuid(),
});

export type CreateCarrierSchema = z.infer<typeof createCarrierSchema>;
export type UpdateCarrierSchema = z.infer<typeof updateCarrierSchema>;
export type CarrierIdParamSchema = z.infer<typeof carrierIdParamSchema>;
