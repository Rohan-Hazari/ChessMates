import { z } from "zod";

export const CronTransalationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  target_language_code: z.string().min(2),
});

export const CronNewsValidator = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  sourceLinks: z.array(z.string().url()),
  imageUrl: z.string().url().optional(),
  publishedAt: z.date().optional(),
  translations: z.array(CronTransalationSchema).optional(),
});

export type CronNewsFetchRequest = z.infer<typeof CronNewsValidator>;
