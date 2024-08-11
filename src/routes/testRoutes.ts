import { Router } from "express";
import asyncFunction from "express-async-handler";

export const testApis = Router();

testApis.get(
  "/",
  asyncFunction(async (req, res) => {
    res.send("Hello from test route");
  })
);
