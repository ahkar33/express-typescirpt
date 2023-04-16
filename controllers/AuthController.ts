import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../utils/db";
import loginUserSchema from "../validations/loginUserSchema";
import { z } from "zod";

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
			res.status(200).json({ message: "successfully login" });
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
