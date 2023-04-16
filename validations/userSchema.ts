import { z } from "zod";

const userSchema = z.object({
	email: z.string().email(),
	name: z.string(),
	age: z.number().min(1),
	password: z.string().min(4),
	isDeleted: z.boolean().optional(),
});

export default userSchema;
