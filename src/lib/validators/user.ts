import { z } from "zod";

export const UserValidator = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type UserPayload = z.infer<typeof UserValidator>;
