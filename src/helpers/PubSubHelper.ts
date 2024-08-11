import { PubSub } from "@google-cloud/pubsub";

import { PubSubTopicsEnum } from "../constants/PubSub";
import { logger } from "../utils/logger";
import config from "../../config";
import { ProductReportHelper } from "./ProductReportHelper";

export class PubSubHelper {
  private static pubSubClient = new PubSub({
    projectId: config.googleCloud.projectId,
  });

  static async publishMessage(payload: { topic: PubSubTopicsEnum; data: any }) {
    const { topic, data } = payload;

    const dataBuffer = Buffer.from(JSON.stringify(data));

    try {
      const result = await this.pubSubClient.topic(topic).publishMessage({
        data: dataBuffer,
      });
      logger.info(`Message ${result} published.`);
    } catch (err) {
      logger.error("Error in publishing message", err);
    }
  }

  static async subscribeToTopic(payload: {
    topic: PubSubTopicsEnum;
    messageHandler: (message: any) => Promise<void> | void;
  }) {
    const { topic, messageHandler } = payload;

    const subscriptionName = `${topic}-sub`;

    const subscription = this.pubSubClient.subscription(subscriptionName);

    const messageHandlerWrapper = async (message: any) => {
      try {
        await messageHandler(message);
      } catch (err) {
        logger.error("Error in message handler", err);
      } finally {
        logger.info(`Acknowledging message ${message.id}`);
        message.ack();
      }
    };

    subscription.on("message", messageHandlerWrapper);

    logger.info(`Listening for messages on ${topic}...`);
  }

  static async listenForMessages() {
    await this.subscribeToTopic({
      topic: PubSubTopicsEnum.ProcessProductReport,
      messageHandler: async (message: any) => {
        const payload = JSON.parse(
          Buffer.from(message.data, "base64").toString()
        );

        await ProductReportHelper.processProductReport(payload);
      },
    });
  }
}
