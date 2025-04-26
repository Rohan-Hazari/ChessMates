import { News } from "@prisma/client";
import { FC } from "react";

interface NewsFeedProps {
  initialNews: News[];
}

const NewsFeed: FC<NewsFeedProps> = ({ initialNews }) => {
  if (!(initialNews && initialNews.length > 0)) return <div>No news </div>;
  return (
    <div className="mt-6">
      {initialNews.map((news: News, ogindex) => {
        return (
          <div className="border-2 shadow-lg px-8 py-6" key={news.id}>
            <div className="text-xl font-bold pb-2">{news.title}</div>
            <div className="text-lg pb-2">{news.description}</div>
            <div>
              Source links
              {news.sourceLinks &&
                news.sourceLinks.length > 0 &&
                news.sourceLinks.map((link: string, index) => (
                  <a
                    className="block break-words text-blue-700 underline"
                    href={link}
                    key={news.id + index}
                  >
                    {link}
                  </a>
                ))}
            </div>

            {ogindex === 0 ? (
              <p className="text-right animate-pulse">Latest news</p>
            ) : (
              <p>{ogindex}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NewsFeed;
