import { Router } from "express";

import { testApis } from "./testRoutes";
import { HealthCheckController } from "../controllers/healthCheckController";

export const apis = Router();

// Health check endpoint
apis.get("/healthCheck", HealthCheckController.healthCheck);

// Test endpoint
apis.use("/test", testApis);

// Add more routes here
