import CustomFeed from "@/components/CustomFeed";
import GeneralFeed from "@/components/GeneralFeed";
import { FeedSkeletonLoading } from "@/components/Loaders/Feed";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { HomeIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const session = await getServerSession();
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Home</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <div className="col-span-2">
          <Suspense fallback={<FeedSkeletonLoading />}>
            {/* @ts-expect-error server component */}
            {session ? <CustomFeed /> : <GeneralFeed />}
          </Suspense>
        </div>
        {/* community info */}
        <div className=" col-span-1 flex flex-col gap-7 overflow-hidden h-fit pb-4 order-first md:order-last">
          <div className="rounded-lg border border-gray-200">
            <div className="bg-orange-100 px-6 py-4">
              <p className="font-semibold py-3 lex items-center gap-1.5">
                <HomeIcon className="w-4 h-4" />
                Home
              </p>
            </div>
            <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">
                  Your Personal ChessMate homepage. Come here to check in with
                  your favourite communities
                </p>
              </div>

              {session?.user ? (
                <Link
                  className={buttonVariants({ className: "w-full mt-4 mb-6" })}
                  href="/c/create"
                >
                  Create Community
                </Link>
              ) : (
                <p className="text-orange-600 font-semibold">
                  Sign in to see options!
                </p>
              )}
            </div>
          </div>
          <div className="rounded-lg p-4 border flex justify-between shadow-lg shadow-amber-100">
            <Link href={"/news"}>Checkout trending news</Link>
            <Badge variant={"outline"}>Beta</Badge>
          </div>
          <div className="rounded-lg p-4 border flex justify-between shadow-lg shadow-amber-100">
            <Link href={"/puzzle"}>Daily puzzles</Link>
            <Badge variant={"outline"}>Beta</Badge>
          </div>
        </div>
      </div>
    </>
  );
}
