import { FC } from "react";
import { TranslatedNews } from "@/types/news";
import NewsPost from "./NewsPost";
interface NewsFeedProps {
  initialNews: TranslatedNews[];
}

const NewsFeed: FC<NewsFeedProps> = ({ initialNews }) => {
  if (!(initialNews && initialNews.length > 0)) return <div>No news </div>;
  return (
    <div className="mt-6">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Today's Headlines</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialNews.map((news: TranslatedNews) => (
            <div key={news.id}>
              <NewsPost news={news} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
