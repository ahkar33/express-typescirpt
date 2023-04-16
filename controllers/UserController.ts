import { Request, Response } from "express";
import { db } from "../utils/db";
import userSchema from "../validations/userSchema";
import { z } from "zod";
import bcrypt from "bcrypt";

const saltRound: number = Number(process.env.SALT_ROUND);

export const findAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await db.user.findMany({
			select: {
				name: true,
				email: true,
				age: true
			},
			where: {
				isDeleted: false,
			},
		});
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json(error);
	}
};

export const findUserById = async (req: Request, res: Response) => {
	try {
		const user = await db.user.findFirstOrThrow({
			where: {
				id: req.params.id,
				isDeleted: false,
			},
		});
		res.status(200).json(user);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(422).json(error.issues);
		}
		res.status(500).json(error);
	}
};

export const createUser = async (req: Request, res: Response) => {
	try {
		const { email, name, age, password } = userSchema.parse(req.body);
		const hash = bcrypt.hashSync(password, saltRound);
		const user = await db.user.create({
			data: {
				email,
				name,
				age,
				password: hash,
			},
		});
		res.status(200).json(user);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(422).json(error.issues);
		}
		res.status(500).json(error);
	}
};

export const updateUserById = async (req: Request, res: Response) => {
	try {
		const user = await db.user.findUniqueOrThrow({
			where: {
				id: req.params.id,
			},
		});
		const requestUser = { ...user, ...req.body };
		const resUser = await db.user.update({
			where: {
				id: req.params.id,
			},
			data: {
				...requestUser,
			},
		});
		res.status(200).json(resUser);
	} catch (error) {
		res.status(500).json(error);
	}
};

export const deleteUserById = async (req: Request, res: Response) => {
	try {
		const user = await db.user.update({
			where: {
				id: req.params.id,
			},
			data: {
				isDeleted: true,
			},
		});
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).json({ message: "not found" });
		}
	} catch (error) {
		res.status(500).json(error);
	}
};

