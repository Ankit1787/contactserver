import dotenv from "dotenv";
dotenv.config();
interface Config {
  port: string;
  mongodbUri: string;
  jwtSecret:string;
}

const config: Config = {
  port: process.env.PORT || "5001",
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/contact",
  jwtSecret:process.env.JWT_SECRET || "default_jwt_secret_key"
};
export default config;
