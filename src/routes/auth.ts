import { Router, json } from "express";
const auth = Router();
auth.use(json());
import User from "../models/User.js";
import CraftBench from "../models/CraftBench.js";
import Folio from "../models/Folio.js";
import { verify } from "jsonwebtoken";
import { verifyConfig } from "../utils/folioConfig.js";
import { populate } from "dotenv";
import { getMetaDataFromUsers } from "../utils/craftBench.js";
import { Meta } from "../types/folioConfigTypes.js";

auth.get("/hello", (req, res) => {
  res.send("Hello - auth");
});

// GitHub Access Token
auth.post("/github", async (req, res) => {
  const { codeParams } = req.body;
  console.log(codeParams);

  // Exchange code for access token
  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: codeParams,
      }),
    }
  );

  const tokenData = await tokenResponse.json();
  console.log("tokenData: ", tokenData);
  const accessToken = tokenData.access_token;

  if (accessToken) {
    const getUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    const userData = await getUserResponse.json();
    // console.log('userData: ', userData);
    if (userData.message === "Bad credentials") {
      res.json({ success: false });
    } else {
      const findUser = await User.findOne({ username: userData.login });
      let dbData: any = {};
      if (findUser) {
        const upd = await User.findOneAndUpdate(
          {
            username: userData.login,
          },
          {
            avatar: userData.avatar_url,
            lastLogin: Date.now(),
          },
          {
            new: true
          }
        ).populate({
          path: "craftBenches",
          populate: {
            path: "folioSelected",
          },
        });
        dbData = await findUser;
      } else {
        const user = await User.create({
          username: userData.login,
          avatar: userData.avatar_url,
          lastLogin: Date.now(),
        });
        dbData = await user;
      }
      let isRecentConfig: Boolean = verifyConfig(dbData.recentConfig);
      let newDbData = {
        username: dbData.username,
        avatar: dbData.avatar,
        isRecentConfig: isRecentConfig,
        craftBenches: [] as Meta[],
      };
      if (dbData.craftBenches && dbData.craftBenches.length > 0) {
        newDbData.craftBenches = getMetaDataFromUsers(dbData.craftBenches);
      }

      // console.log('dbData: ', dbData);
      res.json({
        success: true,
        message: tokenData.access_token,
        userData: userData,
        dbData: newDbData,
      });
    }
    // name, email, avatar_url,
  } else {
    res.json({ success: false });
  }
});

// verify access token
auth.post("/verify", async (req, res) => {
  const accessToken = req.headers["token"] as string;
  if (accessToken) {
    const getUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    const userData = await getUserResponse.json();
    if (userData.message === "Bad credentials") {
      res.json({ success: false });
    } else {
      const findUser = await User.findOne({ username: userData.login });
      if (findUser) {
        console.log("User already exists");
        const upd = await User.findOneAndUpdate(
          {
            username: userData.login,
          },
          {
            avatar: userData.avatar_url,
            lastLogin: Date.now(),
          },
          {
            new: true
          }
        ).populate({
          path: "craftBenches",
          populate: {
            path: "folioSelected",
          },
        });

        let isRecentConfig: boolean = false;
        if (findUser.recentConfig) {
          isRecentConfig = verifyConfig(findUser.recentConfig as any);
        }
        let newDbData = {
          username: findUser.username,
          avatar: findUser.avatar,
          isRecentConfig: isRecentConfig,
          craftBenches: [] as Meta[],
        };
        if (findUser.craftBenches && findUser.craftBenches.length > 0) {
          newDbData.craftBenches = getMetaDataFromUsers(findUser.craftBenches);
        }

        res.json({
          success: true,
          message: accessToken,
          userData: userData,
          dbData: newDbData,
        });
      } else {
        res.json({ success: false });
      }
    }
    // console.log('userData: ', userData);

    // name, avatar_url
  } else {
    res.json({ success: false });
  }
});

export default auth;
