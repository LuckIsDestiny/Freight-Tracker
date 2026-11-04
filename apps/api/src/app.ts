import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import loadsRouter from "./modules/loads/loads.routes.js";
import shipperRouter from "./modules/shippers/shipper.routes.js";
import carrierRouter from "./modules/carriers/carrier.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app: Express = express();

app.use(helmet());
app.use(express.json());
app.use(cors());

app.use("/api/shippers", shipperRouter);
app.use("/api/carriers", carrierRouter);
app.use("/api/loads", loadsRouter);

app.use(errorHandler);

export default app;
