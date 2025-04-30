import React from "react";

export default async function PuzzleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="font-bold text-3xl md:text-4xl">Daily Puzzles</h1>
      {children}
    </div>
  );
}
