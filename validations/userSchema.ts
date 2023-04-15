import { z } from "zod";

const userSchema = z.object({
	email: z.string().email(),
	name: z.string(),
	age: z.number().min(1),
});

export default userSchema;
