import { Request, Response } from "express";
import { db } from "../utils/db";
import userSchema from "../validations/userSchema";
import { z } from "zod";

export const findAllUsers = async (req: Request, res: Response) => {
	try {
		const user = await db.user.findMany();
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json(error);
	}
};

export const findUserById = async (req: Request, res: Response) => {
	try {
		const user = await db.user.findUnique({
			where: {
				id: req.params.id,
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

export const createUser = async (req: Request, res: Response) => {
	try {
		const { email, name, age } = userSchema.parse(req.body);
		const user = await db.user.create({
			data: {
				email,
				name,
				age,
			},
		});
		res.status(200).json(user);
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(422).json(error.issues);
		}
		res.status(500).json(error);
	}
};

export const updateUserById = async(req: Request, res: Response) => {
	try {
		const user = await db.user.findUnique({
			where: {
				id: req.params.id,
			},
		});
		if(!user) {
			res.status(404).json("not found");
		}
		const requestUser = {...user, ...req.body};
		const resUser = await db.user.update({
			where:{
				id: req.params.id
			},
			data: {
				...requestUser
			}
		})
		res.status(200).json(resUser);
	} catch (error) {
		res.status(500).json(error);
	}
}

export const deleteUserById = async (req: Request, res: Response) => {
	try {
		const user = await db.user.delete({
			where: {
				id: req.params.id,
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

// export const deleteAllUsers = async (req: Request, res: Response) => {
// 	const result = await db.user.deleteMany();
// 	res.status(200).json(result);
// };
