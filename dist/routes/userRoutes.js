"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const router = express_1.default.Router();
router.get("/", UserController_1.findAllUsers);
router.get("/:id", UserController_1.findUserById);
router.post("/", UserController_1.createUser);
router.delete("/:id", UserController_1.deleteUserById);
router.patch("/:id", UserController_1.updateUserById);
exports.default = router;
