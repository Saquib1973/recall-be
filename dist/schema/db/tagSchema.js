"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModel = void 0;
const mongoose_1 = require("mongoose");
const tagSchema = new mongoose_1.Schema({
    tag: { type: String, unique: true },
});
exports.TagModel = (0, mongoose_1.model)('tag', tagSchema);
