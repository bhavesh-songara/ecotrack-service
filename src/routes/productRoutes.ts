import { Router } from "express";
import asyncFunction from "express-async-handler";
import { ProductController } from "../controllers/productController";

export const productRoutes = Router();

productRoutes.get(
  "/analysis",
  asyncFunction(ProductController.getProductAnalysis)
);

productRoutes.get(
  "/analysis/v2",
  asyncFunction(ProductController.getProductAnalysisV2)
);
