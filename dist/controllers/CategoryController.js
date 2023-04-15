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
exports.createCategory = exports.updateCategoryById = exports.deleteCategoryById = exports.findCategoryById = exports.findAllCategories = void 0;
const categorySchema_1 = __importDefault(require("../validations/categorySchema"));
const db_1 = require("../utils/db");
const zod_1 = require("zod");
const findAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield db_1.db.category.findMany();
        res.status(200).json(categories);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(422).json(error.issues);
        }
        res.status(500).json(error);
    }
});
exports.findAllCategories = findAllCategories;
const findCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield db_1.db.category.findUniqueOrThrow({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(categories);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(422).json(error.issues);
        }
        res.status(500).json(error);
    }
});
exports.findCategoryById = findCategoryById;
const deleteCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield db_1.db.category.delete({
            where: {
                id: req.params.id,
            },
        });
        if (category) {
            res.status(200).json(category);
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(422).json(error.issues);
        }
        res.status(500).json(error);
    }
});
exports.deleteCategoryById = deleteCategoryById;
const updateCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield db_1.db.category.findUniqueOrThrow({
            where: {
                id: req.params.id,
            },
        });
        const requestCategory = Object.assign(Object.assign({}, category), req.body);
        const resCategory = yield db_1.db.category.update({
            where: {
                id: req.params.id,
            },
            data: Object.assign({}, requestCategory),
        });
        res.status(200).json(resCategory);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.updateCategoryById = updateCategoryById;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = categorySchema_1.default.parse(req.body);
        const category = yield db_1.db.category.create({
            data: {
                name,
            },
        });
        res.status(200).json(category);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(422).json(error.issues);
        }
        res.status(500).json(error);
    }
});
exports.createCategory = createCategory;
