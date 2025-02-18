"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = void 0;
const mongoose_1 = require("mongoose");
const linkSchema = new mongoose_1.Schema({
    hash: String,
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
});
exports.LinkModel = (0, mongoose_1.model)('link', linkSchema);
