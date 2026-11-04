import { z } from "zod";
import { LoadStatus } from "../../generated/prisma/enums.js";

export const createLoadSchema = z.object({
  origin: z.string().trim().min(2),
  destination: z.string().trim().min(2),
  shipperId: z.uuid(),
  carrierId: z.uuid().nullish(),
  estimatedPickupDate: z.string().pipe(z.coerce.date()).nullish(),
  estimatedDeliveryDate: z.string().pipe(z.coerce.date()).nullish(),
});

export const updateLoadSchema = createLoadSchema
  .partial()
  .omit({ shipperId: true });

export const updateLoadStatusSchema = z.object({
  status: z.enum(LoadStatus),
});

export const loadIdParamSchema = z.object({
  loadId: z.uuid(),
});

export type CreateLoadSchema = z.infer<typeof createLoadSchema>;
export type UpdateLoadSchema = z.infer<typeof updateLoadSchema>;
export type UpdateLoadStatusSchema = z.infer<typeof updateLoadStatusSchema>;
export type LoadIdParamSchema = z.infer<typeof loadIdParamSchema>;
