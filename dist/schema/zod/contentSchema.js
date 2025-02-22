"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagValidationZod = void 0;
const zod_1 = require("zod");
exports.tagValidationZod = zod_1.z.object({
    tag: zod_1.z.string().trim().toLowerCase()
});
