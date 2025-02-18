"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../utils/config"));
const userAuthMiddleware = (req, res, next) => {
    const header = req.headers['authorization'];
    const decoded = jsonwebtoken_1.default.verify(header, config_1.default.JWT_SECRET);
    if (decoded) {
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).send("You are not logged in");
    }
};
exports.userAuthMiddleware = userAuthMiddleware;
