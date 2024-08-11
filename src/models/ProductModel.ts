import mongoose from "mongoose";

import { ecotrackDb } from "../connectors/mongodb";

export interface IProduct {
  name?: string;
  description?: string;
  summary?: string;
  metaData?: Record<string, string>;
  kgCO2e?: number;
  price?: number;
  currency?: string;
  brand?: string;
  category?: string;
  subCategory?: string;
  tags?: string[];
  productReportUrl?: string;
  productUrl?: string;
  imageUrl?: string;
  isVerified?: boolean;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: String,
    description: String,
    summary: String,
    metaData: mongoose.Schema.Types.Mixed,
    kgCO2e: Number,
    price: Number,
    currency: String,
    brand: String,
    category: String,
    subCategory: String,
    tags: [String],
    productReportUrl: String,
    productUrl: String,
    imageUrl: String,
  },
  {
    collection: "Products",
    timestamps: true,
  }
);

export const ProductModel = ecotrackDb.model("Product", productSchema);
