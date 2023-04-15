"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllPosts = exports.createPost = void 0;
const db_1 = require("../utils/db");
const zod_1 = require("zod");
const postSchema_1 = __importDefault(require("../validations/postSchema"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, userId, categories } = postSchema_1.default.parse(req.body);
        const user = yield db_1.db.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "user does not exist" });
        }
        const categoriesExist = yield db_1.db.category.findMany({
            where: {
                id: {
                    in: categories,
                },
            },
        });
        if (categoriesExist.length < categories.length) {
            return res
                .status(404)
                .json({ message: "one of the categories do not exit" });
        }
        const post = yield db_1.db.post.create({
            data: {
                name,
                userId,
                categories: {
                    create: categories.map((categoryId) => ({
                        category: {
                            connect: {
                                id: categoryId,
                            },
                        },
                    })),
                },
            },
        });
        res.json(post);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(422).json(error.issues);
        }
        res.status(500).json(error);
    }
});
exports.createPost = createPost;
const findAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield db_1.db.post.findMany({
            include: {
                categories: true,
            },
        });
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.findAllPosts = findAllPosts;
