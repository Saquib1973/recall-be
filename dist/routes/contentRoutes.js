"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contentController_1 = __importDefault(require("../controllers/contentController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const contentRouter = express_1.default.Router();
contentRouter.post('/', authMiddleware_1.userAuthMiddleware, contentController_1.default.create);
contentRouter.get('/', authMiddleware_1.userAuthMiddleware, contentController_1.default.get);
contentRouter.delete('/', authMiddleware_1.userAuthMiddleware, contentController_1.default.delete);
contentRouter.post('/share', authMiddleware_1.userAuthMiddleware, contentController_1.default.share);
contentRouter.get('/share', authMiddleware_1.userAuthMiddleware, contentController_1.default.getSharedStatus);
contentRouter.get('/chunk', authMiddleware_1.userAuthMiddleware, contentController_1.default.getChunk);
contentRouter.get('/search', contentController_1.default.search);
contentRouter.get('/recall/:id', authMiddleware_1.userAuthMiddleware, contentController_1.default.getRecallProtected);
contentRouter.get('/shared/:hash', contentController_1.default.sharedRecall);
exports.default = contentRouter;
