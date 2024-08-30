import {z} from 'zod'

export const ChessPostValidator = z.object({
    title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 50 characters long" }),
  communityId: z.string(),
  description: z.string().max(150,{message:'Description must be at most 150 characters long'}).optional(),
  boardFen:z.string().max(100,{message:'FEN must be at most 100 characters long'}),
  boardSolution: z.string().max(150,{message:'Solution must be at most 150 characters long'}).optional()
})

export type ChessPostPayload = z.infer<typeof ChessPostValidator>