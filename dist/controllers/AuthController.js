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
exports.logout = exports.login = exports.checkToken = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../services/db");
const loginUserSchema_1 = __importDefault(require("../validations/loginUserSchema"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("redis");
const TOKEN_KEY = process.env.TOKEN_KEY;
// Create a Redis client
const redisClient = (0, redis_1.createClient)();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.connect();
}))();
redisClient.on("connect", () => console.log("::> Redis Client Connected"));
redisClient.on("error", (err) => console.log("<:: Redis Client Error", err));
const checkToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, TOKEN_KEY, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.sendStatus(403);
        // Check if the token is still stored in Redis
        const tokenValue = yield redisClient.get(`jwt:${user.id}`);
        if (!tokenValue || tokenValue != token) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    }));
};
exports.checkToken = checkToken;
const getAccessToken = (user) => {
    let accessToken = jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, TOKEN_KEY, {
        expiresIn: "30d",
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
            // if ((await redisClient.exists(`jwt:${user.id}`)) != 0) {
            // 	return res.status(401).json({ message: "already logged in" });
            // }
            let accessToken = getAccessToken(user);
            yield redisClient.setEx(`jwt:${user.id}`, 2592000, accessToken);
            res.status(200).json({
                accessToken: accessToken,
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
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        yield redisClient.del(`jwt:${user.id}`);
        res.status(200).json({ message: "successfully logout" });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.logout = logout;
