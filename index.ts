import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import postRoutes from "./routes/postRoutes";
import authRoutes from "./routes/authRoutes";
import { checkToken } from "./services/checkToken";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/user", checkToken, userRoutes);
app.use("/api/category", checkToken, categoryRoutes);
app.use("/api/post", checkToken, postRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
