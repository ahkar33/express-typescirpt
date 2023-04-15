import express from "express";
import dotenv from "dotenv";
import userRoutes from './routes/userRoutes'

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/api/user', userRoutes);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
