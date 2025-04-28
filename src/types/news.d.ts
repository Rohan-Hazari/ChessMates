import { News, Transalation } from "@prisma/client";

export type TranslatedNews = News & {
  translated: Transalation[];
};
