import { VertexAI, Content } from "@google-cloud/vertexai";
import config from "../../config";

import { GeminiModelEnum } from "../constants/Model";

export class VertextAIHelper {
  private static vertexAI = new VertexAI({
    location: config.googleCloud.location,
    project: config.googleCloud.projectId,
  });

  private static extractJSONFromModelResponse(text: string) {
    try {
      const jsonText = text.replace(/`{3}json\n|(\n\s*)`{3}/g, "");
      return JSON.parse(jsonText);
    } catch (e) {
      return null;
    }
  }

  static async getResponse(payload: {
    model?: GeminiModelEnum;
    contents: Content[];
  }) {
    const { model = GeminiModelEnum.Gemini15ProPreview0514, contents } =
      payload;

    try {
      const generativeModel = this.vertexAI.getGenerativeModel({ model });

      const modelResponse = await generativeModel.generateContent({
        contents,
      });

      const text =
        modelResponse?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

      return { modelResponse, text };
    } catch (e) {
      console.error(e);
      return { modelResponse: null, text: null };
    }
  }

  static async getJSONResponse(payload: {
    model?: GeminiModelEnum;
    contents: Content[];
  }) {
    const { modelResponse, text } = await this.getResponse(payload);

    const jsonResponse = this.extractJSONFromModelResponse(text as string);

    return { jsonResponse, modelResponse, text };
  }
}
