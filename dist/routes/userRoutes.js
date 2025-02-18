"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const userRouter = express_1.default.Router();
userRouter.post("/signup", userController_1.default.signup);
userRouter.post("/signin", userController_1.default.signin);
userRouter.post("/username", userController_1.default.username);
exports.default = userRouter;
