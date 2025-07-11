import React from "react";

export default async function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="font-bold text-3xl md:text-4xl">News page</h1>
      {children}
    </div>
  );
}
