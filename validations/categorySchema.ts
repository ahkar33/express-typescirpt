import { z } from "zod";

const categorySchema = z.object({
  name: z.string()
});

export default categorySchema;
