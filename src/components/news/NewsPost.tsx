"use client";
import { FC, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { extractMainDomain } from "@/lib/utils";
import { TranslatedNews } from "@/types/news";
import { DevanagariLanguages, LanguageDisplayMap } from "@/constants/language";

interface NewsPostProps {
  news: TranslatedNews;
}

const NewsPost: FC<NewsPostProps> = ({ news }) => {
  const [newsLanguage, setNewsLanguage] = useState<string>("hi-EN");
  const [selectedNews, setSelectedNews] = useState<TranslatedNews | null>(null);
  let isDevanagari = DevanagariLanguages.includes(newsLanguage);

  const currentTranslation = useMemo(() => {
    if (newsLanguage === "hi-EN") {
      return { title: news.title, description: news.description };
    }

    const translation = news.translated.find(
      (item) => item.targetLanguage === newsLanguage
    );

    return translation || { title: news.title, description: news.description };
  }, [news, newsLanguage]);

  const handleLanguageChange = (language: string) => {
    setNewsLanguage(language);
  };

  const availableLanguages = useMemo(() => {
    const languages = ["hi-EN"];
    news.translated.forEach((translation) => {
      languages.push(translation.targetLanguage);
    });
    return languages;
  }, [news.translated]);

  return (
    <>
      <Card
        onClick={() => setSelectedNews(news)}
        className="w-full h-full flex flex-col"
      >
        <CardHeader>
          <CardTitle className="text-xl cursor-pointer">
            {currentTranslation.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <p
            className={`${
              isDevanagari ? "tracking-wider" : ""
            }  text-muted-foreground line-clamp-4 cursor-pointer`}
          >
            {currentTranslation.description}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            {news.sourceLinks && news.sourceLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium">Sources:</span>
                <div className="flex flex-wrap gap-2">
                  {news.sourceLinks.map((source, index) => (
                    <Link
                      key={index}
                      href={source}
                      className="text-sm flex items-center gap-1 text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit source: ${extractMainDomain(source)}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {extractMainDomain(source)}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DropdownMenu modal={false}>
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 whitespace-nowrap"
                  aria-label="Select language"
                >
                  {LanguageDisplayMap[newsLanguage] || "Language"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {availableLanguages.map((language) => (
                  <DropdownMenuItem
                    key={language}
                    onClick={() => handleLanguageChange(language)}
                    className={`${
                      newsLanguage === language ? "bg-accent" : ""
                    }`}
                  >
                    {LanguageDisplayMap[language] || language}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </div>
          </DropdownMenu>
        </CardFooter>
      </Card>
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white dark:bg-black p-10 rounded-xl max-w-xl w-full">
            <h2 className="text-2xl font-bold mb-4">
              {currentTranslation.title}
            </h2>
            <p
              className={`${
                isDevanagari ? "tracking-wide" : ""
              }  text-slate-800 cursor-text`}
            >
              {currentTranslation.description}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="text-sm px-4 py-2 bg-primary text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsPost;
