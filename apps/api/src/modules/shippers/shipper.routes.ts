import { Router } from "express";
import * as shipperController from "./shipper.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
  createShipperSchema,
  shipperIdParamSchema,
  updateShipperSchema,
} from "./shipper.validation.js";

const router: Router = Router();

router.get("/", shipperController.getShippers);

router.get(
  "/:shipperId",
  validate(shipperIdParamSchema, "params"),
  shipperController.getShipperById,
);

router.post(
  "/",
  validate(createShipperSchema),
  shipperController.createShipper,
);

router.patch(
  "/:shipperId",
  validate(shipperIdParamSchema, "params"),
  validate(updateShipperSchema),
  shipperController.updateShipper,
);

export default router;
