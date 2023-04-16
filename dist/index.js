"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const checkToken_1 = require("./services/checkToken");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use("/api/user", checkToken_1.checkToken, userRoutes_1.default);
app.use("/api/category", checkToken_1.checkToken, categoryRoutes_1.default);
app.use("/api/post", checkToken_1.checkToken, postRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
