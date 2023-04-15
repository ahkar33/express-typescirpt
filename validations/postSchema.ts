import { z } from "zod";

const postSchema = z.object({
  name: z.string(),
  userId: z.string(),
  categories: z.array(z.string())
})

export default postSchema;
