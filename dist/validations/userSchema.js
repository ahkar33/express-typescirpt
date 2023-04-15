"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const userSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string(),
    age: zod_1.z.number().min(1),
    isDeleted: zod_1.z.boolean().optional(),
});
exports.default = userSchema;
