import { Router } from "express";
import * as carrierController from "./carrier.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
  carrierIdParamSchema,
  createCarrierSchema,
  updateCarrierSchema,
} from "./carrier.validation.js";

const router: Router = Router();

router.get("/", carrierController.getCarriers);
router.get(
  "/:carrierId",
  validate(carrierIdParamSchema, "params"),
  carrierController.getCarrierById,
);
router.post(
  "/",
  validate(createCarrierSchema),
  carrierController.createCarrier,
);
router.patch(
  "/:carrierId",
  validate(carrierIdParamSchema, "params"),
  validate(updateCarrierSchema),
  carrierController.updateCarrier,
);

export default router;
