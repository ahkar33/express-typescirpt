"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string(),
    userId: zod_1.z.string(),
});
exports.default = refreshTokenSchema;
