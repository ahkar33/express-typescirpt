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
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../utils/db");
const loginUserSchema_1 = __importDefault(require("../validations/loginUserSchema"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TOKEN_KEY = process.env.TOKEN_KEY || "dummy_key";
const getAccessToken = (user) => {
    let accessToken = jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, TOKEN_KEY, {
        expiresIn: "30min",
    });
    return accessToken;
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = loginUserSchema_1.default.parse(req.body);
        const user = yield db_1.db.user.findUniqueOrThrow({
            where: {
                email,
            },
        });
        const isValid = bcrypt_1.default.compareSync(password, user.password);
        if (isValid) {
            res.status(200).json({ token: getAccessToken(user) });
        }
        else {
            res.status(401).json({ message: "incorrect email or password" });
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(422).json(error.issues);
        }
        res.status(500).json(error);
    }
});
exports.login = login;
