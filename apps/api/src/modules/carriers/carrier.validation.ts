import { z } from "zod";

export const createShipperSchema = z.object({
    contactPerson: z.string().trim().min(2),
    company: z.string().trim().min(2),
});