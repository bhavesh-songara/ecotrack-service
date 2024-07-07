import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const connect = async () => {
  const host = process.env.MONGODB_HOST;
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;

  if (!username || !password) {
    throw new Error("Username and password not provided");
  }

  const mongoUrl = `mongodb+srv://${username}:${password}@${host}`;

  logger.info(`Connecting to MongoDB: ${host}`);

  await mongoose.connect(mongoUrl, {
    readPreference: "primary",
    connectTimeoutMS: 30000,
    socketTimeoutMS: 20000,
  });

  logger.info(`Connected to MongoDB: ${host}`);
};

export const ecotrackDb = mongoose.connection.useDb("ecotrack");
