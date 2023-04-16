import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../services/db";
import loginUserSchema from "../validations/loginUserSchema";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import refreshTokenSchema from "../validations/refreshTokenSchema";

const TOKEN_KEY = process.env.TOKEN_KEY as string;
const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY as string;

export const refreshToken = async (req: Request, res: Response) => {
	try {
		const { refreshToken, userId } = refreshTokenSchema.parse(req.body);
		if (refreshToken == null || userId == null) return res.sendStatus(401);
		const isUserExist = await db.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!isUserExist) {
			return res.status(404).json({ message: "user does not exist" });
		}
		jwt.verify(refreshToken, REFRESH_TOKEN_KEY, async (err: any, user: any) => {
			if (err) return res.sendStatus(403);
			let newAccessToken = getAccessToken(user);
			let newRefreshToken = getRefreshToken(user);
			return res
				.status(200)
				.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(422).json(error.issues);
		}
		res.status(500).json(error);
	}
};

const getRefreshToken = (user: User) => {
	let refreshToken = jwt.sign(
		{ email: user.email, id: user.id },
		REFRESH_TOKEN_KEY,
		{
			expiresIn: "90d",
		}
	);
	return refreshToken;
};

const getAccessToken = (user: User) => {
	let accessToken = jwt.sign({ email: user.email, id: user.id }, TOKEN_KEY, {
		expiresIn: "30min",
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
			res.status(200).json({
				accessToken: getAccessToken(user),
				refreshToken: getRefreshToken(user),
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
