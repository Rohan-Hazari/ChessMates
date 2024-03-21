import { z } from "zod";

export const UserValidator = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(25),
});

export type UserPayload = z.infer<typeof UserValidator>;
