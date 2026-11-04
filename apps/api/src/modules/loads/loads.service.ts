import { LoadStatus, Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { buildUpdatePayload } from "../../utils/buildUpdatePayload.js";
import type {
  CreateLoadSchema,
  UpdateLoadSchema,
  UpdateLoadStatusSchema,
} from "./loads.validation.js";

export const getLoads = async () => {
  return prisma.load.findMany({
    include: {
      shipper: { select: { company: true } },
      carrier: { select: { name: true } },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
};

export const getLoadById = async (loadId: string) => {
  const load = await prisma.load.findUnique({
    where: { id: loadId },
    include: {
      shipper: { select: { company: true } },
      carrier: { select: { name: true } },
    },
  });
  if (!load) {
    throw new AppError("Load not found", 404);
  }
  return load;
};

export const createLoad = async (data: CreateLoadSchema) => {
  return prisma.load.create({
    data: {
      origin: data.origin,
      destination: data.destination,
      shipperId: data.shipperId,
      carrierId: data.carrierId ?? null,
      estimatedPickupDate: data.estimatedPickupDate ?? null,
      estimatedDeliveryDate: data.estimatedDeliveryDate ?? null,
    },
  });
};

export const updateLoad = async (loadId: string, data: UpdateLoadSchema) => {
  const updatePayload: Prisma.LoadUncheckedUpdateInput = {};
  return prisma.load.update({
    where: { id: loadId },
    data: buildUpdatePayload(updatePayload, data),
  });
};

export const transitionStatus: Record<LoadStatus, LoadStatus[]> = {
  [LoadStatus.QUOTED]: [LoadStatus.BOOKED, LoadStatus.CANCELED],
  [LoadStatus.BOOKED]: [LoadStatus.IN_TRANSIT, LoadStatus.CANCELED],
  [LoadStatus.IN_TRANSIT]: [LoadStatus.DELIVERED],
  [LoadStatus.DELIVERED]: [],
  [LoadStatus.CANCELED]: [],
};

export const updateLoadStatus = async (
  loadId: string,
  data: UpdateLoadStatusSchema,
) => {
  const loadStatus = await prisma.load.findUnique({
    where: { id: loadId },
    select: { status: true },
  });
  if (!loadStatus) {
    throw new AppError("Load not found", 404);
  }
  const currStatus = loadStatus.status;
  const newStatus = data.status;
  const updatePayload: Prisma.LoadUncheckedUpdateInput = {};
  if (transitionStatus[currStatus].includes(newStatus)) {
    updatePayload.status = newStatus;
  } else {
    throw new AppError(
      `Cannot change status from ${currStatus} to ${newStatus}`,
      409,
    );
  }
  if (newStatus === "IN_TRANSIT") {
    updatePayload.pickedUpAt = new Date();
  }
  if (newStatus === "DELIVERED") {
    updatePayload.deliveredAt = new Date();
  }
  try {
    return await prisma.load.update({
      where: { id: loadId, status: currStatus },
      data: updatePayload,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new AppError("Load status changed, please retry", 409);
      }
    }
    throw error;
  }
};
