import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userData: any;
        dbData: any;
        accessToken: string;
      };
    }
  }
}
