import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import postRoutes from "./routes/postRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/post", postRoutes);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
