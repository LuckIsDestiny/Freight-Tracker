import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type {
  CreateLoadSchema,
  UpdateLoadSchema,
  UpdateLoadStatusSchema,
} from "./loads.validation.js";

export const getLoads = async () => {
  return prisma.load.findMany({ orderBy: { createdAt: "desc" } });
};

export const getLoadById = async (loadId: string) => {
  return prisma.load.findUnique({ where: { id: loadId } });
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
  if (data.origin !== undefined) {
    updatePayload.origin = data.origin;
  }
  if (data.destination !== undefined) {
    updatePayload.destination = data.destination;
  }
  if (data.carrierId !== undefined) {
    updatePayload.carrierId = data.carrierId;
  }
  if (data.estimatedPickupDate !== undefined) {
    updatePayload.estimatedPickupDate = data.estimatedPickupDate;
  }
  if (data.estimatedDeliveryDate !== undefined) {
    updatePayload.estimatedDeliveryDate = data.estimatedDeliveryDate;
  }
  return prisma.load.update({
    where: { id: loadId },
    data: updatePayload,
  });
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

  if (currStatus === "QUOTED") {
    if (newStatus === "BOOKED" || newStatus === "CANCELED") {
      updatePayload.status = newStatus;
    } else {
      throw new AppError("Wrong status input", 409);
    }
  } else if (currStatus === "BOOKED") {
    if (newStatus === "IN_TRANSIT") {
      updatePayload.status = newStatus;
      updatePayload.pickedUpAt = new Date();
    } else if (newStatus === "CANCELED") {
      updatePayload.status = newStatus;
    } else {
      throw new AppError("Wrong status input", 409);
    }
  } else if (currStatus === "IN_TRANSIT") {
    if (newStatus === "DELIVERED") {
      updatePayload.status = newStatus;
      updatePayload.deliveredAt = new Date();
    } else {
      throw new AppError("Wrong status input", 409);
    }
  } else if (currStatus === "CANCELED" || currStatus === "DELIVERED") {
    throw new AppError("Wrong status input", 409);
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
