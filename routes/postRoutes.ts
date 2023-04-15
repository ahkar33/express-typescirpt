import express from "express";
import { createPost, findAllPosts } from "../controllers/PostController";

const router = express.Router();

router.get("/", findAllPosts);
router.post("/", createPost);

export default router;
