import { Vote } from "@prisma/client";

export type CachedPost = {
  id: string;
  title: string;
  authorId: string;
  authorUsername: string;
  content: string;
  createdAt: Date;
  postType?: string | null;
  boardFen?: string | null;
  gamePGN?: string | null;
};
