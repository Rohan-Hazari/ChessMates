import { z } from "zod";

export const CronPuzzleValidator = z.object({
  title: z.string().min(1),
  theme: z.string().min(1),
  difficulty: z.string().min(1),
  hint: z.string().min(1),
  solution: z.string(),
  mate_in_n: z.number(),
  fen: z.string(),
});
