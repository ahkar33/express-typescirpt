import express from "express";
import {
	createCategory,
	deleteCategoryById,
	findAllCategories,
  findCategoryById,
  updateCategoryById,
} from "../controllers/CategoryController";

const router = express.Router();

router.get("/", findAllCategories);
router.get("/:id", findCategoryById);
router.delete("/:id", deleteCategoryById);
router.post("/", createCategory);
router.patch("/:id", updateCategoryById);

export default router;
