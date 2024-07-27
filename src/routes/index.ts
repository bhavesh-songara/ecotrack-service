import { Router } from "express";

import { testApis } from "./testRoutes";
import { HealthCheckController } from "../controllers/healthCheckController";
import { productRoutes } from "./productRoutes";

export const apis = Router();

// Health check endpoint
apis.get("/healthCheck", HealthCheckController.healthCheck);

// Test endpoint
apis.use("/test", testApis);

// Other endpoints
apis.use("/product", productRoutes);
