import { Router, json, Request, Response } from "express";
import authCheck from "../middlewares/authCheck.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import CraftBench from "../models/CraftBench.js";
import User from "../models/User.js";
import { Octokit } from "octokit";
import {
  checkGithubRepoExists,
  commitFolioToGithub,
  createGithubRepo,
  deleteGithubRepo,
  publishFolioToGithub,
} from "../utils/github.js";
import { generateHTMLContent } from "../utils/craftBench.js";
import { getFolioConfigJSON } from "../utils/gemini.js";

const craftBench = Router();
craftBench.use(json());
craftBench.use(asyncHandler(authCheck));

craftBench.get(
  "/myspace",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = req.user?.dbData._id;
      if (!userId) {
        res.status(401).json({ error: true, message: "Unauthorized" });
        return;
      }

      const user = await User.findById(userId).populate({
        path: "craftBenches",
        populate: {
          path: "folioSelected",
          model: "Folio",
          select: "folioName folioAvatar",
        },
      });
      if (!user) {
        res.status(404).json({ error: true, message: "User not found" });
        return;
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

craftBench.get(
  "/:craftId",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const craftId = req.params.craftId;
      if (!craftId) {
        res.status(400).json({ error: true, message: "Invalid craftId" });
        return;
      }

      const craftBench = await CraftBench.findById(craftId).populate({
        path: "folioSelected",
        model: "Folio",
        select: "folioName folioAvatar",
      });
      if (!craftBench) {
        res.status(404).json({ error: true, message: "CraftBench not found" });
        return;
      }

      res.status(200).json({
        error: false,
        message: "CraftBench retrieved successfully",
        craftBench,
      });
    } catch (err: any) {
      console.log("Error retrieving CraftBench", err);
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
        res.status(400).json({ error: true, message: "Invalid request body" });
        return;
      }

      const findCraftBench = await CraftBench.findOne({
        craftName: meta.craftName,
        userCreated: req.user?.dbData._id,
      });

      if (findCraftBench) {
        res.status(400).json({
          error: true,
          message: "CraftBench with this name already exists",
        });
        return;
      }

      const newCraftBench = await CraftBench.create({
        craftName: meta.craftName,
        currentConfig: folioConfig,
        userCreated: req.user?.dbData._id,
        repoLink: "",
        folioSelected: meta?.folioId,
      });

      if (!newCraftBench) {
        res
          .status(500)
          .json({ error: true, message: "Failed to create CraftBench" });
        return;
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
        res.status(500).json({ error: true, message: "Failed to update user" });
        return;
      }
      res.status(201).json({
        error: false,
        message: "CraftBench created successfully",
        craftId: newCraftBench._id.toString(),
      });
      return;
    } catch (err: any) {
      res.status(500).json({
        error: true,
        message: "Server Error",
        errorMessage: err && err.message ? err.message : String(err),
      });
    }
  })
);

craftBench.put(
  "/config",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      if (req.user === undefined) {
        res.status(401).json({ error: true, message: "Unauthorized" });
        return;
      }
      const { craftId, folioConfig } = req.body;
      await CraftBench.findByIdAndUpdate(craftId, {
        currentConfig: folioConfig,
      });

      await User.updateOne(
        { _id: req.user.dbData._id },
        { recentConfig: folioConfig }
      );

      res
        .status(200)
        .json({ error: false, message: "CraftBench updated successfully" });
    } catch (err: any) {
      res.status(500).json({
        error: true,
        errorMessage: "Server Error",
        message: err && err.message ? err.message : String(err),
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
        res.status(400).json({ error: true, message: "Invalid craftId" });
        return;
      }
      if (req.user === undefined || !req.user.accessToken) {
        res.status(401).json({ error: true, message: "Unauthorized" });
        return;
      }

      const { html, craftName } = await generateHTMLContent(craftId,req.user?.dbData._id);
      if (!html) {
        res
          .status(404)
          .json({ error: true, message: "Failed to generate HTML" });
        return;
      }
      res.status(200).send(html);
    } catch (err: any) {
      res.status(500).json({
        error: true,
        message: "Server Error",
        errorMessage: err && err.message ? err.message : String(err),
      });
    }
  })
);

craftBench.get("/check/:name",asyncHandler(async (req: Request, res: Response) => {
  try {
    if (req.user === undefined) {
      res.status(401).json({ error: true, message: "Unauthorized" });
      return;
    }
    const userId = req.user?.dbData._id;
    const craftName = req.params.name.toLowerCase();
    const craftExists = await CraftBench.exists({ userCreated: userId, craftName });
    res.status(200).json({
      error: false,
      message: "Craft existence check completed",
      exists: craftExists == null ? false : true,
    });
  } catch (err: any) {
    res.status(500).json({
      error: true,
      message: "Server Error",
      errorMessage: err && err.message ? err.message : String(err),
    });
  }
}));

craftBench.post(
  "/publish/:craftId",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      if (req.user === undefined || !req.user.accessToken) {
        res.status(401).json({ error: true, message: "Unauthorized" });
        return;
      }
      const accessToken = req.user.accessToken;
      const craftId = req.params.craftId as string;
      const userId = req.user?.dbData._id;

      const { html, craftName } = await generateHTMLContent(craftId,userId);
      if (!html) {
        res
          .status(404)
          .json({ error: true, message: "Failed to generate HTML" });
        return;
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
        res.status(error.response.status).json({
          error: error.response.data.message || "Error from GitHub API",
        });
        return;
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

craftBench.delete(
  "/delete",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { craftId } = req.body;

      if (!craftId || typeof craftId !== "string") {
        throw new Error("Invalid or No craftId provided");
      }
      if (!req.user || !req.user.accessToken) {
        res.status(401).json({ error: true, message: "Unauthorized" });
        return;
      }

      const userName = req.user.userData.login;

      const accessToken = req.user.accessToken;

      const octokit = new Octokit({
        auth: accessToken,
      });

      const craftData = await CraftBench.findOne({
        _id: craftId,
        userCreated: req.user?.dbData._id,
      });

      if (!craftData || !craftData.craftName) {
        res.status(404).json({
          error: true,
          message:
            "CraftBench not found or you do not have permission to delete it",
        });
        return;
      }

      const isPublished = craftData.status === "published";

      if (isPublished) {
        const doesRepoExists = await checkGithubRepoExists(
          octokit,
          craftData.craftName,
          userName
        );
        if (!doesRepoExists) {
          res.status(500).json({
            error: true,
            message: "GitHub repository does not exist",
          });
        } else {
          const isRepoDeleted = await deleteGithubRepo(
            octokit,
            craftData.craftName,
            userName
          );
          if (!isRepoDeleted) {
            res.status(500).json({
              error: true,
              message: "Failed to delete the GitHub repository",
            });
          }
        }
      }

      await CraftBench.findByIdAndDelete(craftId);
      await User.updateOne(
        {
          _id: req.user?.dbData._id,
        },
        {
          $pull: {
            craftBenches: craftId,
          },
        }
      );

      res.status(200).json({
        error: false,
        message: "CraftBench and GitHub repository deleted successfully",
      });
    } catch (err: any) {
      console.error("Error deleting CraftBench: ", err.message);
      res.status(500).json({
        error: true,
        message: err.message || "Failed to delete the Craftbench",
      });
    }
  })
);

craftBench.put(
  "/unpublish",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { craftId } = req.body;

      if (!craftId || typeof craftId !== "string") {
        throw new Error("Invalid or No craftId provided");
      }
      if (!req.user || !req.user.accessToken) {
        res.status(401).json({ error: true, message: "Unauthorized" });
        return;
      }

      const userName = req.user.userData.login;

      const accessToken = req.user.accessToken;

      const octokit = new Octokit({
        auth: accessToken,
      });

      const craftData = await CraftBench.findOne({
        _id: craftId,
        userCreated: req.user?.dbData._id,
      });

      if (!craftData || !craftData.craftName) {
        res.status(404).json({
          error: true,
          message:
            "CraftBench not found or you do not have permission to delete it",
        });
        return;
      }

      const isPublished = craftData.status === "published";

      if (isPublished) {
        const doesRepoExists = await checkGithubRepoExists(
          octokit,
          craftData.craftName,
          userName
        );
        if (!doesRepoExists) {
          res.status(500).json({
            error: true,
            message: "GitHub repository does not exist",
          });
        } else {
          const isRepoDeleted = await deleteGithubRepo(
            octokit,
            craftData.craftName,
            userName
          );
          if (!isRepoDeleted) {
            res.status(500).json({
              error: true,
              message: "Failed to delete the GitHub repository",
            });
          }
        }
      }

      await CraftBench.findByIdAndUpdate(craftId, {
        status: "inProgress",
        repoLink: null,
      });

      res.status(200).json({
        error: false,
        message: "CraftBench unpublished successfully",
      });
    } catch (err: any) {
      console.error("Error unpublishing CraftBench: ", err.message);
      res.status(500).json({
        error: true,
        message: err.message || "Failed to unpublish the Craftbench",
      });
    }
  })
);

craftBench.post("/upload", asyncHandler(async (req: Request, res: Response) => {
  const chunks: Buffer[] = [];

  req.on("data", (chunk) => chunks.push(chunk));

  req.on("end", async () => {
    try {
      const buffer = Buffer.concat(chunks);
      const uint8Array = new Uint8Array(buffer);
      const extractedText = await getFolioConfigJSON(uint8Array);
      
      res.json({
        message: "PDF text extracted successfully",
        folioConfig: extractedText
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}));


export default craftBench;
