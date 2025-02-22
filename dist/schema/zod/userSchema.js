"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.userSignInSchema = exports.userSignupSchema = void 0;
const zod_1 = require("zod");
exports.userSignupSchema = zod_1.z.object({
    username: zod_1.z.string().transform((username) => username.trim().toLowerCase()),
    password: zod_1.z
        .string()
        .min(5, 'Password must be atleast 5 characters long')
        .transform((password) => password.trim()),
});
exports.userSignInSchema = zod_1.z.object({
    username: zod_1.z.string().transform((username) => username.trim().toLowerCase()),
    password: zod_1.z
        .string()
        .min(5, 'Password must be atleast 5 characters long')
        .transform((password) => password.trim()),
});
exports.resetPasswordSchema = zod_1.z.object({
    password: zod_1.z
        .string()
        .min(5, 'Password must be atleast 5 characters long')
        .transform((password) => password.trim()),
});
