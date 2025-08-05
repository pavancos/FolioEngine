import { Router, json, Request, Response } from "express";
import Folio from "../models/Folio.js";

const folio = Router();
folio.use(json());

folio.get("/health", async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Folio Engine is running",
  });
});

folio.get("/", async (req: Request, res: Response) => {
  try {
    const folios = await Folio.find({});
    res.status(200).json({
      error: false,
      message: "Fetched all folios",
      data: folios,
    });
  } catch (err: any) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});
folio.get("/:folioName", async (req: Request, res: Response) => {
  const { folioName } = req.params;
  try {
    const folioData = await Folio.findOne({ folioName });
    if (!folioData) {
      res.status(404).json({
        error: true,
        message: "Folio not found",
      });
      return;
    }
    res.status(200).json({
      error: false,
      message: "Folio fetched successfully",
      data: folioData,
    });
  } catch (err: any) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

export default folio;
