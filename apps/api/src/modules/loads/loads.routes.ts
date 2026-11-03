import { Router } from "express";
import * as loadController from "./loads.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
  createLoadSchema,
  idParamSchema,
  updateLoadSchema,
  updateLoadStatusSchema,
} from "./loads.validation.js";

const router: Router = Router();

router.get("/", loadController.getLoads);
router.get(
  "/:loadId",
  validate(idParamSchema, "params"),
  loadController.getLoadById,
);
router.post("/", validate(createLoadSchema), loadController.createLoad);
router.patch(
  "/:loadId",
  validate(idParamSchema, "params"),
  validate(updateLoadSchema),
  loadController.updateLoad,
);
router.post(
  "/:loadId/status",
  validate(idParamSchema, "params"),
  validate(updateLoadStatusSchema),
  loadController.updateLoadStatus,
);

export default router;
