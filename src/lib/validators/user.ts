import { z } from "zod";

export const SignUpUserValidator = z.object({
  name: z.string().min(3).max(21).regex(/^\S*$/),
  email: z.string().email(),
  password: z.string().min(6).max(25),
});

export const SignInUserValidator = z.object({
  name: z.string().min(3).max(21).regex(/^\S*$/),
  password: z.string().min(6).max(25),
});

export type UserPayload = z.infer<typeof SignUpUserValidator>;
