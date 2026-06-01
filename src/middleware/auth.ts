import { NextFunction, Response ,Request} from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
interface jwtPayload{
 id:string
}
export interface AuthRequest extends Request{
    user?:jwtPayload
}

export const authMiddleware=async(req:AuthRequest,res:Response,next:NextFunction):Promise<void>=>{
   
try {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader?.startsWith("Bearer ")) {
        res.status(401).json({message:"Unauthorized"});
        return;
       
    }
    const token=authHeader?.split(" ")[1];
    const decoded= jwt.verify(token,config.jwtSecret) as jwtPayload;
    
    req.user=decoded;
    next()
} catch (error) {
    res.status(401).json({message:"Internal server error"});
}
}