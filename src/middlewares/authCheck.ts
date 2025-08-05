import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";

const authCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req.headers["token"] as string;
  if (!accessToken) {
    res.status(401).json({ success: false, message: "No token provided" });
    return;
  }

  try {
    const getUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    const userData = await getUserResponse.json();

    if (userData.message === "Bad credentials") {
      res.status(401).json({ success: false, message: "Bad credentials" });
      return;
    }

    const findUser = await User.findOne({ username: userData.login });
    if (!findUser) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    findUser.avatar = userData.avatar_url;
    findUser.lastLogin = new Date();
    await findUser.save();

    req.user = {
      userData,
      dbData: findUser,
      accessToken,
    };

    next();
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err?.message || String(err),
    });
  }
};

export default authCheck;
