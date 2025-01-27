"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env = {
    PORT: process.env.PORT || 3000,
    MONGODB_URL: process.env.MONGODB_URL || null,
    JWT_SECRET: process.env.JWT_SECRET || "TEST",
};
exports.default = env;
