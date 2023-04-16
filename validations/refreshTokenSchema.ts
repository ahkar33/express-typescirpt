import { z } from "zod";

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
  userId: z.string(),
})

export default refreshTokenSchema;
