import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { buildUpdatePayload } from "../../utils/buildUpdatePayload.js";
import type {
  CreateCarrierSchema,
  UpdateCarrierSchema,
} from "./carrier.validation.js";

export const getCarriers = async () => {
  return prisma.carrier.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
};

export const getCarrierById = async (carrierId: string) => {
  const carrier = await prisma.carrier.findUnique({
    where: { id: carrierId },
    include: {
      _count: {
        select: {
          loads: {
            where: {
              status: { notIn: ["CANCELED", "DELIVERED"] },
            },
          },
        },
      },
    },
  });
  if (!carrier) {
    throw new AppError("Carrier not found", 404);
  }
  return carrier;
};

export const createCarrier = async (data: CreateCarrierSchema) => {
  return prisma.carrier.create({
    data: {
      mcNumber: data.mcNumber,
      name: data.name,
      contactPerson: data.contactPerson,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail ?? null,
    },
  });
};

export const updateCarrier = async (
  carrierId: string,
  data: UpdateCarrierSchema,
) => {
  const updatePayload: Prisma.CarrierUncheckedUpdateInput = {};
  return prisma.carrier.update({
    where: { id: carrierId },
    data: buildUpdatePayload(updatePayload, data),
  });
};
