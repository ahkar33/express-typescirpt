import express from "express";
import { checkToken, login, logout } from "../controllers/AuthController";

const router = express.Router();

router.post("/login", login);
router.post("/logout", checkToken, logout);

export default router;
