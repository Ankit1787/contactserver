import { NextFunction, Response ,Request} from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
interface JwtPayload {

  id: string;

}
 export interface AuthRequest extends Request {

  user?: JwtPayload;

}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;
    // console.log(header,req.headers);
    if (!header || typeof header !== "string") {
      res.status(401).json({ message: "Access denied" });
      return;
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token,config.jwtSecret) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};