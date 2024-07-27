import fs from "fs";

import { PromptHelper } from "../helpers/PromptHelper";
import { VertextAIHelper } from "../helpers/VertexAIHelper";
import fetcher from "../utils/fetcher";

import createHttpError from "http-errors";
import { CommonUtils } from "../utils/common";

export class ProductService {
  static async getProductAnalysis(payload: { imageSrc: string }) {
    const { imageSrc } = payload;

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
                mimeType: "image/jpeg",
              },
            },
          ],
        },
      ],
    });

    return { data: jsonResponse };
  }
}
