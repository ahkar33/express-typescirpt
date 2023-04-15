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
const db_1 = require("../utils/db");
const userSchema_1 = __importDefault(require("../validations/userSchema"));
const zod_1 = require("zod");
const findAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.user.findMany();
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.findAllUsers = findAllUsers;
const findUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.user.findUnique({
            where: {
                id: req.params.id,
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
exports.findUserById = findUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, age } = userSchema_1.default.parse(req.body);
        const user = yield db_1.db.user.create({
            data: {
                email,
                name,
                age,
            },
        });
        res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(422).json(error.issues);
        }
        res.status(500).json(error);
    }
});
exports.createUser = createUser;
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.user.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!user) {
            res.status(404).json("not found");
        }
        const requestUser = Object.assign(Object.assign({}, user), req.body);
        const resUser = yield db_1.db.user.update({
            where: {
                id: req.params.id
            },
            data: Object.assign({}, requestUser)
        });
        res.status(200).json(resUser);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.updateUserById = updateUserById;
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.user.delete({
            where: {
                id: req.params.id,
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
// export const deleteAllUsers = async (req: Request, res: Response) => {
// 	const result = await db.user.deleteMany();
// 	res.status(200).json(result);
// };
