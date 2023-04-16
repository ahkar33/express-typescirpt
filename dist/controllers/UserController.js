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
exports.deleteUserById = exports.updateUserById = exports.createUser = exports.findUserById = exports.findAllUsers = void 0;
const db_1 = require("../services/db");
const userSchema_1 = __importDefault(require("../validations/userSchema"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUND = Number(process.env.SALT_ROUND);
const getAllUsers = (pagination) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.db.user.findMany(Object.assign(Object.assign({ select: {
                id: true,
                name: true,
                email: true,
                age: true,
            }, where: {
                isDeleted: false,
            } }, pagination), { orderBy: {
                name: "asc",
            } }));
        return users;
    }
    catch (error) {
        return error;
    }
});
const findAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { page, row } = req.query;
        if (page) {
            const users = yield getAllUsers({
                skip: ((_a = Number(row)) !== null && _a !== void 0 ? _a : 5) * Number(page),
                take: (_b = Number(row)) !== null && _b !== void 0 ? _b : 5,
            });
            return res.status(200).json(users);
        }
        const users = yield getAllUsers();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.findAllUsers = findAllUsers;
const findUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.user.findFirstOrThrow({
            where: {
                id: req.params.id,
                isDeleted: false,
            },
        });
        res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(422).json(error.issues);
        }
        res.status(500).json(error);
    }
});
exports.findUserById = findUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, age, password } = userSchema_1.default.parse(req.body);
        const hash = bcrypt_1.default.hashSync(password, SALT_ROUND);
        yield db_1.db.user.create({
            data: {
                email,
                name,
                age,
                password: hash,
            },
        });
        res.status(200).json("successfully created");
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(422).json(error.issues);
        }
        res.status(500).json(error);
    }
});
exports.createUser = createUser;
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.user.findUniqueOrThrow({
            where: {
                id: req.params.id,
            },
        });
        const requestUser = Object.assign(Object.assign({}, user), req.body);
        yield db_1.db.user.update({
            where: {
                id: req.params.id,
            },
            data: Object.assign({}, requestUser),
        });
        res.status(200).json("successfully updated");
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.updateUserById = updateUserById;
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.user.update({
            where: {
                id: req.params.id,
            },
            data: {
                isDeleted: true,
            },
        });
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.deleteUserById = deleteUserById;
