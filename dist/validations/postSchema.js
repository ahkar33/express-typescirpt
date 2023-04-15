"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const postSchema = zod_1.z.object({
    name: zod_1.z.string(),
    userId: zod_1.z.string(),
    categories: zod_1.z.array(zod_1.z.string())
});
exports.default = postSchema;
