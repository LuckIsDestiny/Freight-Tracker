import { z } from "zod";
import { LoadStatus } from "../../generated/prisma/enums.js";

export const createLoadSchema = z.object({
  origin: z.string().trim().min(2),
  destination: z.string().trim().min(2),
  shipperId: z.uuid(),
  carrierId: z.uuid().optional(),
  estimatedPickupDate: z.string().pipe(z.coerce.date()).optional(),
  estimatedDeliveryDate: z.string().pipe(z.coerce.date()).optional(),
});

export const updateLoadSchema = createLoadSchema
  .partial()
  .omit({ shipperId: true });

export const updateLoadStatusSchema = z.object({
  status: z.enum(LoadStatus),
});

export const idParamSchema = z.object({
  loadId: z.uuid().optional(),
  shipperId: z.uuid().optional(),
});

export type CreateLoadSchema = z.infer<typeof createLoadSchema>;
export type UpdateLoadSchema = z.infer<typeof updateLoadSchema>;
export type UpdateLoadStatusSchema = z.infer<typeof updateLoadStatusSchema>;
export type IdParamSchema = z.infer<typeof idParamSchema>;
