import express from "express";
import userController from '../controllers/userController';

const userRouter = express.Router();

userRouter.post("/signup", userController.signup);
userRouter.post("/signin", userController.signin);
userRouter.post("/username", userController.username);

export default userRouter;