import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../services/db";
import loginUserSchema from "../validations/loginUserSchema";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { createClient } from "redis";

const TOKEN_KEY = process.env.TOKEN_KEY as string;

// Create a Redis client
const redisClient = createClient();
(async () => {
	await redisClient.connect();
})();

redisClient.on("connect", () => console.log("::> Redis Client Connected"));
redisClient.on("error", (err) => console.log("<:: Redis Client Error", err));

export const checkToken = (req: any, res: Response, next: NextFunction) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);
	jwt.verify(token, TOKEN_KEY, async (err: any, user: any) => {
		if (err) return res.sendStatus(403);
		// Check if the token is still stored in Redis
		const tokenValue = await redisClient.get(`jwt:${user.id}`);
		if (!tokenValue || tokenValue != token) {
			return res.status(401).json({ message: "Invalid token" });
		}
		req.user = user;
		next();
	});
};

const getAccessToken = (user: User) => {
	let accessToken = jwt.sign({ email: user.email, id: user.id }, TOKEN_KEY, {
		expiresIn: "30d",
	});
	return accessToken;
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = loginUserSchema.parse(req.body);
		const user = await db.user.findUniqueOrThrow({
			where: {
				email,
			},
		});
		const isValid = bcrypt.compareSync(password, user.password);
		if (isValid) {
			// if ((await redisClient.exists(`jwt:${user.id}`)) != 0) {
			// 	return res.status(401).json({ message: "already logged in" });
			// }
			let accessToken = getAccessToken(user);
			await redisClient.setEx(`jwt:${user.id}`, 2592000, accessToken);
			res.status(200).json({
				accessToken: accessToken,
			});
		} else {
			res.status(401).json({ message: "incorrect email or password" });
		}
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(422).json(error.issues);
		}
		res.status(500).json(error);
	}
};

export const logout = async (req: any, res: Response) => {
	try {
		const user = req.user;
		await redisClient.del(`jwt:${user.id}`);
		res.status(200).json({ message: "successfully logout" });
	} catch (error) {
		res.status(500).json(error);
	}
};
