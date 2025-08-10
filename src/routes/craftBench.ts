import { Router, json, Request, Response } from "express";
import authCheck from "../middlewares/authCheck.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import CraftBench from "../models/CraftBench.js";
import User from "../models/User.js";
import { templates } from "../folios/index.js";

const craftBench = Router();
craftBench.use(json());
craftBench.use(asyncHandler(authCheck));

craftBench.post(
  "/new",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { folioConfig, meta } = req.body;
      if (!folioConfig || !meta) {
        return res
          .status(400)
          .json({ error: true, message: "Invalid request body" });
      }

      const newCraftBench = await CraftBench.create({
        craftName: meta.craftName,
        currentConfig: folioConfig,
        userCreated: req.user?.dbData._id,
        repoLink: "",
        folioSelected: meta?.folioId,
      });

      if (!newCraftBench) {
        return res
          .status(500)
          .json({ error: true, message: "Failed to create CraftBench" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        {
          _id: req.user?.dbData._id,
        },
        {
          $push: {
            craftBenches: newCraftBench._id,
          },
          recentConfig: folioConfig,
        },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(500)
          .json({ error: true, message: "Failed to update user" });
      }
      return res.status(201).json({
        error: false,
        message: "CraftBench created successfully",
        craftId: newCraftBench._id.toString(),
      });
    } catch (err: any) {
      res.status(500).json({
        error: true,
        message: "Server Error",
        errorMessage: err && err.message ? err.message : String(err),
      });
    }
  })
);


craftBench.get('/download/:craftId',asyncHandler(async (req: Request, res: Response) => {
  try {
    const craftId = req.params.craftId as string;
    // console.log('craftId: ', craftId);
    
    if (!craftId) {
      return res.status(400).json({ error: true, message: "Invalid craftId" });
    }

    const cb  = await CraftBench.findOne(
      { _id: craftId }
    ).populate(
      {
        path: "folioSelected",
        select: "folioName",
        model: "Folio"
      }
    );
    // console.log('cb: ', cb);
    
    if (!cb) {
      return res.status(404).json({ error: true, message: "CraftBench not found" });
    }
    const folio = cb.folioSelected as { folioName?: string };

    if (!folio || !folio.folioName) {
      return res.status(404).json({ error: true, message: "Folio not found" });
    }
    const template = templates[folio.folioName];
    const generatedHTML = template ? template(cb.currentConfig) : "";
    return res.status(200).send(generatedHTML);
  } catch (err: any) {
    res.status(500).json({
      error: true,
      message: "Server Error",
      errorMessage: err && err.message ? err.message : String(err),
    });
  }
}));

export default craftBench;
