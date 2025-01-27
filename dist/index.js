"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const db_1 = __importDefault(require("./utils/db"));
const contentRoutes_1 = __importDefault(require("./routes/contentRoutes"));
const cors_1 = __importDefault(require("cors"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['*', 'http://localhost:3000', 'http://localhost:3001'], // Allow requests from this origin
    credentials: true, // Allow cookies and credentials
}));
app.use("/api/v1/user", userRoutes_1.default);
app.use("/api/v1/content", contentRoutes_1.default);
app.use("/api/v1/health", healthRoutes_1.default);
(0, db_1.default)(app);
