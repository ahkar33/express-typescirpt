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
exports.createNewUser = void 0;
const db_1 = require("../utils/db");
const userSchema_1 = __importDefault(require("../validations/userSchema"));
const createNewUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, age } = userSchema_1.default.parse(req.body);
    const user = yield db_1.db.user.create({
        data: {
            email,
            name,
            age,
        },
    });
});
exports.createNewUser = createNewUser;
