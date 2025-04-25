import { INFINITE_SCROLLING_PAGINATION_NEWS_RESULT } from "@/config";
import { db } from "@/lib/db";
import React from "react";

export default async function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const news = await db.news.findMany({
    take: INFINITE_SCROLLING_PAGINATION_NEWS_RESULT,
  });
  return (
    <div>
      <h1 className="font-bold text-3xl md:text-4xl">News page</h1>
      {children}
    </div>
  );
}
