import { z } from "zod";

const loginUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4),
});

export default loginUserSchema;