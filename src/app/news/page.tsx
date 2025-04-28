import NewsFeed from "@/components/news/NewsFeed";
import { INFINITE_SCROLLING_PAGINATION_NEWS_RESULT } from "@/config";
import { db } from "@/lib/db";

const page = async () => {
  const news = await db.news.findMany({
    include: {
      translated: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: INFINITE_SCROLLING_PAGINATION_NEWS_RESULT,
  });
  return (
    <div>
      <NewsFeed initialNews={news} />
    </div>
  );
};

export default page;
