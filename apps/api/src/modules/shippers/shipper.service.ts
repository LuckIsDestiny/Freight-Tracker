import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { buildUpdatePayload } from "../../utils/buildUpdatePayload.js";
import type {
  CreateShipperSchema,
  UpdateShipperSchema,
} from "./shipper.validation.js";

export const getShippers = async () => {
  return prisma.shipper.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
};

export const getShipperById = async (shipperId: string) => {
  const shipper = await prisma.shipper.findUnique({
    where: { id: shipperId },
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
  if (!shipper) {
    throw new AppError("Shipper not found", 404);
  }
  return shipper;
};

export const createShipper = async (data: CreateShipperSchema) => {
  return prisma.shipper.create({
    data: {
      company: data.company,
      contactPerson: data.contactPerson,
      contactEmail: data.contactEmail ?? null,
      contactPhone: data.contactPhone ?? null,
    },
  });
};

export const updateShipper = async (
  shipperId: string,
  data: UpdateShipperSchema,
) => {
  const updatePayload: Prisma.ShipperUncheckedUpdateInput = {};
  const finalUpdatePayload = buildUpdatePayload(updatePayload, data);
  const shipper = await prisma.shipper.findUnique({
    where: { id: shipperId },
    select: { contactEmail: true, contactPhone: true },
  });
  if (!shipper) {
    throw new AppError("Shipper not found", 404);
  }
  const mergedContactInfo = { ...shipper };
  if (data.contactEmail !== undefined) {
    mergedContactInfo.contactEmail = data.contactEmail;
  }
  if (data.contactPhone !== undefined) {
    mergedContactInfo.contactPhone = data.contactPhone;
  }
  if (
    mergedContactInfo.contactEmail === null &&
    mergedContactInfo.contactPhone === null
  ) {
    throw new AppError("Provide a phone number or an email", 400);
  }
  return prisma.shipper.update({
    where: { id: shipperId },
    data: finalUpdatePayload,
  });
};
