import { PromptHelper } from "../helpers/PromptHelper";
import { VertextAIHelper } from "../helpers/VertexAIHelper";
import fetcher from "../utils/fetcher";

import createHttpError from "http-errors";
import { CommonUtils } from "../utils/common";

export class ProductService {
  private static async getBase64Image(imageSrc: string) {
    const isBase64 = imageSrc.startsWith("data:image");

    let base64Image = "";
    let mimeType = "";

    if (isBase64) {
      base64Image = imageSrc.split(",")[1];
      mimeType = imageSrc.split(";")[0].split(":")[1];
    } else {
      const { data, error, headers } = await fetcher({
        url: imageSrc,
        responseType: "arraybuffer",
      });

      if (error) {
        throw new createHttpError.BadRequest("Invalid image source");
      }

      base64Image = CommonUtils.arrayBufferToBase64(data);
      mimeType = headers?.["content-type"];
    }

    return { base64Image, mimeType };
  }

  static async getProductAnalysis(payload: { imageSrc: string }) {
    const { imageSrc } = payload;

    const { base64Image, mimeType } = await this.getBase64Image(imageSrc);

    const prompt = PromptHelper.getProductAnalysisPrompt();

    const { jsonResponse } = await VertextAIHelper.getJSONResponse({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
            {
              inlineData: {
                data: base64Image,
                mimeType,
              },
            },
          ],
        },
      ],
    });

    return { data: jsonResponse };
  }

  static async getProductAnalysisV2(payload: { imageSrc: string }) {
    const { imageSrc } = payload;

    const { base64Image, mimeType } = await this.getBase64Image(imageSrc);

    const productInformationExtractionPrompt =
      await PromptHelper.getProductInformationExtractionPrompt({});

    const productInfoExtractionResult = await VertextAIHelper.getJSONResponse({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: productInformationExtractionPrompt,
            },
            {
              inlineData: {
                data: base64Image,
                mimeType,
              },
            },
          ],
        },
      ],
    });

    const product = productInfoExtractionResult?.jsonResponse;

    if (!product) {
      throw new createHttpError.BadRequest("Invalid Product");
    }

    const productSustainabilityMetricPrompt =
      await PromptHelper.getProductSustainabilityMetricsAndInsightsPrompt({
        product,
        version: "2",
      });

    const sustainabilityMetricResult = await VertextAIHelper.getJSONResponse({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: productSustainabilityMetricPrompt,
            },
          ],
        },
      ],
    });

    return {
      product,
      ...(sustainabilityMetricResult?.jsonResponse || {}),
    };
  }
}
