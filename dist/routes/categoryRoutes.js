"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CategoryController_1 = require("../controllers/CategoryController");
const router = express_1.default.Router();
router.get("/", CategoryController_1.findAllCategories);
router.get("/:id", CategoryController_1.findCategoryById);
router.delete("/:id", CategoryController_1.deleteCategoryById);
router.post("/", CategoryController_1.createCategory);
router.patch("/:id", CategoryController_1.updateCategoryById);
exports.default = router;
