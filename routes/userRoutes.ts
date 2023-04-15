import express from "express";
import {
	createUser,
	deleteUserById,
	findAllUsers,
	findUserById,
	updateUserById,
} from "../controllers/UserController";

const router = express.Router();

router.get("/", findAllUsers);
router.get("/:id", findUserById);
router.post("/", createUser);
router.delete("/:id", deleteUserById);
router.patch("/:id", updateUserById);

export default router;
