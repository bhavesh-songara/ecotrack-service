import { Request, Response } from "express";
import Joi from "joi";

import { validateJoiSchema } from "../utils/validateJoiSchema";
import { ProductService } from "../services/productService";

export class ProductController {
  static async getProductAnalysis(req: Request, res: Response) {
    const { imageSrc } = req.query as { imageSrc: string };

    validateJoiSchema({
      schema: Joi.object({
        imageSrc: Joi.string().required(),
      }),
      data: { imageSrc },
    });

    const data = await ProductService.getProductAnalysis({ imageSrc });

    res.send(data);
  }

  static async getProductAnalysisV2(req: Request, res: Response) {
    const { imageSrc } = req.query as { imageSrc: string };

    validateJoiSchema({
      schema: Joi.object({
        imageSrc: Joi.string().required(),
      }),
      data: { imageSrc },
    });

    const data = await ProductService.getProductAnalysisV2({ imageSrc });

    res.send(data);
  }
}
