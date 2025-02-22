import express from "express";
import userController from '../controllers/userController';
import { userAuthMiddleware } from '../middleware/authMiddleware';

const userRouter = express.Router();

userRouter.post("/signup", userController.signup);
userRouter.post("/signin", userController.signin);
userRouter.post("/username", userController.username);
userRouter.post("/reset-password",userAuthMiddleware, userController.resetPassword);

export default userRouter;