import type { Request, Response } from "express";
import * as loadService from "./loads.service.js";
import type {
  CreateLoadSchema,
  LoadIdParamSchema,
  UpdateLoadSchema,
  UpdateLoadStatusSchema,
} from "./loads.validation.js";
import { AppError } from "../../utils/AppError.js";

export const getLoads = async (req: Request, res: Response) => {
  const loads = await loadService.getLoads();
  res.status(200).json({ success: true, data: loads });
};
export const getLoadById = async (req: Request, res: Response) => {
  const { loadId } = req.params as LoadIdParamSchema;
  if (!loadId) {
    throw new AppError("Load Id required", 400);
  }
  const load = await loadService.getLoadById(loadId);
  res.status(200).json({ success: true, data: load });
};

export const createLoad = async (req: Request, res: Response) => {
  const data: CreateLoadSchema = req.body;
  const load = await loadService.createLoad(data);
  res.status(201).json({ success: true, data: load });
};

export const updateLoad = async (req: Request, res: Response) => {
  const { loadId } = req.params as LoadIdParamSchema;
  if (!loadId) {
    throw new AppError("Load Id required", 400);
  }
  const data: UpdateLoadSchema = req.body;
  const load = await loadService.updateLoad(loadId, data);
  res.status(200).json({ success: true, data: load });
};

export const updateLoadStatus = async (req: Request, res: Response) => {
  const { loadId } = req.params as LoadIdParamSchema;
  if (!loadId) {
    throw new AppError("Load Id required", 400);
  }
  const data: UpdateLoadStatusSchema = req.body;
  const load = await loadService.updateLoadStatus(loadId, data);
  res.status(200).json({ success: true, data: load });
};
