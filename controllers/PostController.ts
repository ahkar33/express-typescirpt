import { Request, Response } from "express";
import { db } from "../utils/db";
import { z } from "zod";
import postSchema from "../validations/postSchema";

export const createPost = async (req: Request, res: Response) => {
	try {
		const { name, userId, categories } = postSchema.parse(req.body);
		const user = await db.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!user) {
			return res.status(404).json({ message: "user does not exist" });
		}
		const categoriesExist = await db.category.findMany({
			where: {
				id: {
					in: categories,
				},
			},
		});
		if (categoriesExist.length < categories.length) {
			return res
				.status(404)
				.json({ message: "one of the categories do not exit" });
		}
		const post = await db.post.create({
			data: {
				name,
				userId,
				categories: {
					create: categories.map((categoryId) => ({
						category: {
							connect: {
								id: categoryId,
							},
						},
					})),
				},
			},
		});
		res.json(post);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(422).json(error.issues);
		}
		res.status(500).json(error);
	}
};

export const findAllPosts = async (req: Request, res: Response) => {
	try {
		const posts = await db.post.findMany({
			include: {
				categories: true,
			},
		});
		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json(error);
	}
};
