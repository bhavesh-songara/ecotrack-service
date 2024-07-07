import { app } from "./app";
import config from "../config";
import { logger } from "./utils/logger";

async function bootstrap() {
  try {
    const { servicePort } = config;

    app.listen(servicePort, () => {
      logger.info(`Server started on port ${servicePort}`);
    });
  } catch (error) {
    logger.error("Error starting server", error);
    process.exit(1);
  }
}

process.on("uncaughtException", function (err: Error) {
  logger.error("uncaughtException", err);
});

process.on("unhandledRejection", function (err: Error) {
  logger.error("unhandledRejection", err);
});

bootstrap();
