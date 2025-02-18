"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignInSchema = exports.userSignupSchema = void 0;
const zod_1 = require("zod");
const userSignupSchema = zod_1.z.object({
    username: zod_1.z.string().transform(username => username.trim().toLowerCase()),
    password: zod_1.z.string().min(5, "Password must be atleast 5 characters long").transform(password => password.trim())
});
exports.userSignupSchema = userSignupSchema;
const userSignInSchema = zod_1.z.object({
    username: zod_1.z.string().transform(username => username.trim().toLowerCase()),
    password: zod_1.z.string().min(5, "Password must be atleast 5 characters long").transform(password => password.trim())
});
exports.userSignInSchema = userSignInSchema;
