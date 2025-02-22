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
const app = (0, express_1.default)();
let healthCheckCount = 0;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'https://recalll.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.get('/', (req, res) => {
    console.log('Root endpoint hit');
    res.status(200).send('Server is running');
});
app.get('/health', (req, res) => {
    console.log('Health endpoint hit');
    res.status(200).send(`/health call : ${healthCheckCount++}`);
});
app.use('/api/v1/user', userRoutes_1.default);
app.use('/api/v1/content', contentRoutes_1.default);
// Start the server first
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Then connect to DB
(0, db_1.default)().catch((err) => {
    console.error('Failed to connect to database:', err);
});
exports.default = app;
