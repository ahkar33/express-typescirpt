import { Request, Response } from "express";
import categorySchema from "../validations/categorySchema";
import { db } from "../utils/db";
import { z } from "zod";

export const findAllCategories = async (req: Request, res: Response) => {
	try {
		const categories = await db.category.findMany();
		res.status(200).json(categories);
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(422).json(error.issues);
		}
		res.status(500).json(error);
	}
};

export const findCategoryById = async (req: Request, res: Response) => {
	try {
		const categories = await db.category.findUniqueOrThrow({
			where: {
				id: req.params.id,
			},
		});
		res.status(200).json(categories);
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(422).json(error.issues);
		}
		res.status(500).json(error);
	}
};

export const deleteCategoryById = async (req: Request, res: Response) => {
	try {
		const category = await db.category.delete({
			where: {
				id: req.params.id,
			},
		});
		if (category) {
			res.status(200).json(category);
		} else {
			res.status(404).json({ message: "not found" });
		}
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(422).json(error.issues);
		}
		res.status(500).json(error);
	}
};

export const updateCategoryById = async (req: Request, res: Response) => {
	try {
		const category = await db.category.findUniqueOrThrow({
			where: {
				id: req.params.id,
			},
		});
		const requestCategory = { ...category, ...req.body };
		const resCategory = await db.category.update({
			where: {
				id: req.params.id,
			},
			data: {
				...requestCategory,
			},
		});
		res.status(200).json(resCategory);
	} catch (error) {
		res.status(500).json(error);
	}
};

export const createCategory = async (req: Request, res: Response) => {
	try {
		const { name } = categorySchema.parse(req.body);
		const category = await db.category.create({
			data: {
				name,
			},
		});
		res.status(200).json(category);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(422).json(error.issues);
		}
		res.status(500).json(error);
	}
};
