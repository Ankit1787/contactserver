import express, { Response, Request } from "express";
import config from "./config/config.js";
import connectDatabase from "./config/database.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import { authMiddleware } from "./middleware/auth.js";
const app = express();

app.use(express.json());
app.use("/auth",authRouter)
app.use("/user",authMiddleware,userRouter)
app.get("/", (_req:Request, res:Response) => {
  res.json({
    message: "server running",
    success: true,
  });
});

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(config.port, () => {
      console.log(`Server is running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

startServer();

