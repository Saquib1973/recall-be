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
const config_1 = __importDefault(require("./utils/config"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'https://recalll.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.get('/', (req, res) => {
    res.status(200).send('Server is running');
});
app.use('/api/v1/user', userRoutes_1.default);
app.use('/api/v1/content', contentRoutes_1.default);
// First connect to DB, then start the server
(0, db_1.default)().then(() => {
    app.listen(config_1.default.PORT, () => {
        console.log(`Server is running on port ${config_1.default.PORT}`);
    });
});
