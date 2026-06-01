import {Router} from "express"
import { createContact, getAllContacts, getProfile } from "../controllers/user.controller.js";
const userRouter = Router();

userRouter.get("/userdetails",getProfile)
userRouter.get("/contacts",getAllContacts)
userRouter.post("/contacts/create",createContact)

export default userRouter;