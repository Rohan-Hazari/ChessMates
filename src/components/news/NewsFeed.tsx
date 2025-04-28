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
        <div className="space-y-6">
          {initialNews.map((news: TranslatedNews) => (
            <NewsPost news={news} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
