import pdf from "pdf-parse";
import { JSDOM } from "jsdom";
import _ from "lodash";

import fetcher from "../utils/fetcher";
import { logger } from "../utils/logger";
import { VertextAIHelper } from "./VertexAIHelper";
import { PromptHelper } from "./PromptHelper";
import { ProductModel } from "../models/ProductModel";
import { PubSubHelper } from "./PubSubHelper";
import { PubSubTopicsEnum } from "../constants/PubSub";

export class ProductReportHelper {
  static async extractPdfText(pdfData: Buffer): Promise<string> {
    try {
      const pdfBuffer = Buffer.from(pdfData);
      const pdfParsed = await pdf(pdfBuffer);
      return pdfParsed.text;
    } catch (error) {
      logger.error("Error extracting PDF text:", error);
      throw error;
    }
  }

  static async processProductReport(payload: { productReportUrl: string }) {
    const { productReportUrl } = payload;

    logger.info(`Processing product report from ${productReportUrl}`);

    try {
      const reportExists = await ProductModel.exists({
        productReportUrl,
      });

      if (reportExists) {
        throw new Error(`Product report already exists: ${productReportUrl}`);
      }

      const report = await fetcher({
        url: productReportUrl,
        responseType: "arraybuffer",
      });

      if (report.error) {
        throw new Error(`Error fetching product report: ${productReportUrl}`);
      }

      const pdfBuffer = Buffer.from(report.data);

      const reportText = await this.extractPdfText(pdfBuffer);

      const prompt = PromptHelper.getProductReportPrompt({ reportText });

      const { jsonResponse } = await VertextAIHelper.getJSONResponse({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      });

      if (!Array.isArray(jsonResponse)) {
        throw new Error("Invalid response from Vertex AI");
      }

      jsonResponse.forEach((product) => {
        product.productReportUrl = productReportUrl;
      });

      await ProductModel.insertMany(jsonResponse);
    } catch (err) {
      logger.error(`Error processing product report: ${productReportUrl}`, err);
    }
  }

  static async bulkProcessProductReports(productReportUrls: string[]) {
    logger.info(`Bulk processing product reports ${productReportUrls.length}`);
    const existingReports = await ProductModel.find({
      productReportUrl: { $in: productReportUrls },
    });

    const existingReportsMap = _.keyBy(existingReports, "productReportUrl");

    const newReports = productReportUrls.filter(
      (url) => !existingReportsMap[url]
    );

    logger.info(`New reports to process: ${newReports.length}`);

    for (let i = 0; i < newReports.length; i++) {
      const productReportUrl = newReports[i];

      setTimeout(async () => {
        await PubSubHelper.publishMessage({
          topic: PubSubTopicsEnum.ProcessProductReport,
          data: { productReportUrl },
        });
      }, i * 1000);
    }
  }

  static async syncAppleProductReports() {
    const baseUrl = "https://www.apple.com";
    const path = "in/environment";
    const { data, error } = await fetcher({ url: `${baseUrl}/${path}` });
    const dom = new JSDOM(data);
    const reportLinks = Array.from(
      dom.window.document.querySelectorAll(".report-link")
    ).map((link) => {
      const href = link.getAttribute("href");
      return `${baseUrl}${href}`;
    });

    await this.bulkProcessProductReports(reportLinks);
  }

  static async syncGoogleProductReports() {
    const baseUrl = "https://sustainability.google/reports";

    const { data, error } = await fetcher({ url: baseUrl });

    const dom = new JSDOM(data);

    const reportCards = dom.window.document.querySelectorAll(".report-card");

    const reportLinks = [] as string[];
    const categoriesToProcess = [
      "Watches",
      "Laptops",
      "Phones",
      "Smart Home",
      "phones",
      "Other",
    ];

    reportCards.forEach((card) => {
      const dataCardAttribute = card.getAttribute("data-card");

      if (dataCardAttribute) {
        try {
          const dataCard = JSON.parse(dataCardAttribute);

          const href = dataCard?.ctaOne?.href;
          const category = dataCard?.category;

          if (categoriesToProcess.includes(category) && href) {
            reportLinks.push(href);
          }
        } catch (err) {
          logger.error("Error parsing data-card attribute", err);
        }
      }
    });

    logger.info(`Found ${reportLinks.length} reports to process`);

    await this.bulkProcessProductReports(reportLinks);
  }
}
