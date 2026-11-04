import type { Request, Response } from "express";
import * as shipperService from "./shipper.service.js";
import type {
  CreateShipperSchema,
  ShipperIdParamSchema,
  UpdateShipperSchema,
} from "./shipper.validation.js";

export const getShippers = async (req: Request, res: Response) => {
  const shippers = await shipperService.getShippers();
  res.status(200).json({ success: true, data: shippers });
};

export const getShipperById = async (req: Request, res: Response) => {
  const { shipperId } = req.params as ShipperIdParamSchema;
  const shipper = await shipperService.getShipperById(shipperId);
  res.status(200).json({ success: true, data: shipper });
};

export const createShipper = async (req: Request, res: Response) => {
  const data: CreateShipperSchema = req.body;
  const shipper = await shipperService.createShipper(data);
  res.status(201).json({ success: true, data: shipper });
};

export const updateShipper = async (req: Request, res: Response) => {
  const { shipperId } = req.params as ShipperIdParamSchema;
  const data: UpdateShipperSchema = req.body;
  const shipper = await shipperService.updateShipper(shipperId, data);
  res.status(200).json({ success: true, data: shipper });
};
