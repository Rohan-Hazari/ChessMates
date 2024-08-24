import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  if (!q) return new Response("Invalid query", { status: 400 });

  const result = await db.community.findMany({
    where: {
      name: {
        mode: "insensitive",
        contains: q,
      },
    },
    include: {
      _count: true,
    },
    take: 5,
  });

  console.log(result);

  return new Response(JSON.stringify(result));
}
