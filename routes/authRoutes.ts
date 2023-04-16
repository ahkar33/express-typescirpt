import express from "express";
import { login, refreshToken } from "../controllers/AuthController";

const router = express.Router();

router.post('/login', login);
router.post('/refresh-token', refreshToken);

export default router;
