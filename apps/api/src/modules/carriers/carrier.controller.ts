import type { Request, Response } from "express";
import * as carrierService from "./carrier.service.js";
import type {
  CarrierIdParamSchema,
  CreateCarrierSchema,
  UpdateCarrierSchema,
} from "./carrier.validation.js";

export const getCarriers = async (req: Request, res: Response) => {
  const carriers = await carrierService.getCarriers();
  res.status(200).json({ success: true, data: carriers });
};

export const getCarrierById = async (req: Request, res: Response) => {
  const { carrierId } = req.params as CarrierIdParamSchema;
  const carrier = await carrierService.getCarrierById(carrierId);
  res.status(200).json({ success: true, data: carrier });
};

export const createCarrier = async (req: Request, res: Response) => {
  const data: CreateCarrierSchema = req.body;
  const carrier = await carrierService.createCarrier(data);
  res.status(201).json({ success: true, data: carrier });
};

export const updateCarrier = async (req: Request, res: Response) => {
  const { carrierId } = req.params as CarrierIdParamSchema;
  const data: UpdateCarrierSchema = req.body;
  const carrier = await carrierService.updateCarrier(carrierId, data);
  res.status(200).json({ success: true, data: carrier });
};
