import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateToken =  (user: { _id: Types.ObjectId }):string => {
  const token =  jwt.sign({ id: user._id }, config.jwtSecret, {
    expiresIn: "7d",
  });
  return token;
};
