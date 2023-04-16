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
exports.login = exports.refreshToken = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../services/db");
const loginUserSchema_1 = __importDefault(require("../validations/loginUserSchema"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshTokenSchema_1 = __importDefault(require("../validations/refreshTokenSchema"));
const TOKEN_KEY = process.env.TOKEN_KEY;
const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken, userId } = refreshTokenSchema_1.default.parse(req.body);
        if (refreshToken == null || userId == null)
            return res.sendStatus(401);
        const isUserExist = yield db_1.db.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!isUserExist) {
            return res.status(404).json({ message: "user does not exist" });
        }
        jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_KEY, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return res.sendStatus(403);
            let newAccessToken = getAccessToken(user);
            let newRefreshToken = getRefreshToken(user);
            return res
                .status(200)
                .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        }));
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(422).json(error.issues);
        }
        res.status(500).json(error);
    }
});
exports.refreshToken = refreshToken;
const getRefreshToken = (user) => {
    let refreshToken = jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, REFRESH_TOKEN_KEY, {
        expiresIn: "90d",
    });
    return refreshToken;
};
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
            res.status(200).json({
                accessToken: getAccessToken(user),
                refreshToken: getRefreshToken(user),
            });
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
