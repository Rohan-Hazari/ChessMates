import { db } from "@/lib/db";

import { CronNewsValidator } from "@/lib/validators/news";
import { z } from "zod";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    const {
      title,
      description,
      sourceLinks,
      publishedAt,
      translations,
      imageUrl,
    } = CronNewsValidator.parse(body);
    const news = await db.news.create({
      data: {
        title: title,
        description: description,
        sourceLinks: sourceLinks,
        imageUrl: imageUrl,
      },
    });

    if (translations && translations?.length > 0) {
      await db.transalation.createMany({
        data: translations.map((t) => ({
          newsId: news.id,
          title: t.title,
          description: t.description,
          targetLanguage: t.target_language_code,
        })),
      });
    }
    return new Response(news.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ message: "Validation error", issues: error.errors }),
        {
          status: 422,
        }
      );
    }

    return new Response("Could not post, please try again later", {
      status: 500,
    });
  }
}
