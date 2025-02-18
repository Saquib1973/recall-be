"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModel = void 0;
const mongoose_1 = require("mongoose");
const contentSchema = new mongoose_1.Schema({
    title: { type: String },
    link: String,
    description: String,
    type: { type: String, default: 'others' },
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'tag' }],
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'user', required: true },
}, {
    timestamps: true,
});
contentSchema.index({ title: 'text', description: 'text', tags: 'text' });
exports.ContentModel = (0, mongoose_1.model)('content', contentSchema);
