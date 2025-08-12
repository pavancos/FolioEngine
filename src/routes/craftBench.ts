import { Router, json, Request, Response } from "express";
import authCheck from "../middlewares/authCheck.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import CraftBench from "../models/CraftBench.js";
import User from "../models/User.js";
import { Octokit } from "octokit";
import { 
  commitFolioToGithub,
  createGithubRepo,
  publishFolioToGithub,
} from "../utils/github.js";
import { generateHTMLContent } from "../utils/craftBench.js";

const craftBench = Router();
craftBench.use(json());
craftBench.use(asyncHandler(authCheck));

craftBench.get(
  "/myspace",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = req.user?.dbData._id;
      if (!userId) {
        return res.status(401).json({ error: true, message: "Unauthorized" });
      }

      const user = await User.findById(userId).populate({
        path: "craftBenches",
        populate: {
          path: "folioSelected",
          model:"Folio",
          select: "folioName folioAvatar",
        },
      });
      if (!user) {
        return res.status(404).json({ error: true, message: "User not found" });
      }

      const craftBenches = user.craftBenches.map((bench: any) => ({
        name: bench.craftName,
        repoLink: bench.repoLink,
        status: bench.status,
        folioSelectedName: bench.folioSelected?.folioName,
        folioSelectedAvatar: bench.folioSelected?.folioAvatar,
        craftId: bench._id,
      }));

      res.status(200).json({
        error: false,
        message: "User's craft benches retrieved successfully",
        craftBenches: craftBenches,
      });
    } catch (err: any) {
      console.log("Error retrieving user's craft benches", err);
      res.status(500).json({
        error: true,
        message: "Server Error",
        errorMessage: err && err.message ? err.message : String(err),
      });
    }
  })
);

craftBench.post(
  "/new",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      let { folioConfig, meta, isRecentConfig } = req.body;
      console.log("folioConfig", folioConfig);
      if (isRecentConfig && req.user?.dbData.recentConfig) {
        console.log("Received folioConfig: ", req.user?.dbData.recentConfig);
        folioConfig = req.user.dbData.recentConfig;
      }
      if (!folioConfig || !meta) {
        console.log("FolioConfig in Meta not found");
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

craftBench.get(
  "/download/:craftId",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const craftId = req.params.craftId as string;
      if (!craftId) {
        return res
          .status(400)
          .json({ error: true, message: "Invalid craftId" });
      }

      const { html, craftName } = await generateHTMLContent(craftId);
      if (!html) {
        return res
          .status(404)
          .json({ error: true, message: "Failed to generate HTML" });
      }
      return res.status(200).send(html);
    } catch (err: any) {
      res.status(500).json({
        error: true,
        message: "Server Error",
        errorMessage: err && err.message ? err.message : String(err),
      });
    }
  })
);

craftBench.post(
  "/publish/:craftId",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      if (req.user === undefined || !req.user.accessToken) {
        return res.status(401).json({ error: true, message: "Unauthorized" });
      }
      const accessToken = req.user.accessToken;
      const craftId = req.params.craftId as string;

      const { html, craftName } = await generateHTMLContent(craftId);
      if (!html) {
        return res
          .status(404)
          .json({ error: true, message: "Failed to generate HTML" });
      }

      const repoName = `${craftName}`;

      const octokit = new Octokit({
        auth: accessToken,
      });

      const repoResponse = await createGithubRepo(octokit, repoName);

      const commitResponse = await commitFolioToGithub(
        octokit,
        repoName,
        repoResponse,
        html
      );

      const publishResponse = await publishFolioToGithub(
        octokit,
        repoName,
        repoResponse
      );

      await CraftBench.findByIdAndUpdate(craftId, {
        status: "published",
        repoLink: repoResponse.html_url,
      });

      res.json({
        success: true,
        message: "Successfully Published your Folio",
        folioUrl: publishResponse,
      });
    } catch (error: any) {
      console.error(
        "Error creating repository, README.md, or preview branch:",
        error
      );

      if (error.response) {
        return res.status(error.response.status).json({
          error: error.response.data.message || "Error from GitHub API",
        });
      }

      return res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

export default craftBench;
