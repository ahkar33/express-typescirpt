"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/AuthController");
const router = express_1.default.Router();
router.post('/login', AuthController_1.login);
router.post('/refresh-token', AuthController_1.refreshToken);
exports.default = router;
