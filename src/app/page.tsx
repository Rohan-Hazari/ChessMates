import CustomFeed from "@/components/CustomFeed";
import GeneralFeed from "@/components/GeneralFeed";
import { FeedSkeletonLoading } from "@/components/Loaders/Feed";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import {
  HomeIcon,
  Newspaper,
  Puzzle,
  Plus,
  TrendingUp,
} from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const session = await getServerSession();
  return (
    <>
      <div className="flex items-center gap-3 mb-1">
        <h1 className="font-bold text-3xl md:text-4xl text-slate-900">Home</h1>
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-700 border-amber-200"
        >
          <TrendingUp className="w-3 h-3 mr-1" />
          Feed
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-6 py-6">
        <div className="col-span-2">
          <Suspense fallback={<FeedSkeletonLoading />}>
            {/* @ts-expect-error server component */}
            {session ? <CustomFeed /> : <GeneralFeed />}
          </Suspense>
        </div>
        {/* Sidebar */}
        <div className="col-span-1 flex flex-col gap-5 overflow-hidden h-fit pb-4 order-first md:order-last">
          {/* Welcome Card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <HomeIcon className="w-4 h-4" />
                Home
              </p>
            </div>
            <div className="px-6 py-4 space-y-3">
              <p className="text-slate-500 text-sm leading-relaxed">
                Your personal ChessMates homepage. Come here to check in with
                your favourite communities.
              </p>

              {session?.user ? (
                <Link
                  className={buttonVariants({
                    className:
                      "w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-sm group",
                  })}
                  href="/c/create"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create Community
                </Link>
              ) : (
                <p className="text-amber-600 font-semibold text-sm">
                  Sign in to see options!
                </p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <Link
            href="/news"
            className="group rounded-xl p-4 border border-slate-200 bg-white shadow-sm flex justify-between items-center hover:border-amber-300 hover:shadow-md hover:shadow-amber-100/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 rounded-lg p-2">
                <Newspaper className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                Trending News
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-blue-600 border-blue-200"
            >
              Beta
            </Badge>
          </Link>
          <Link
            href="/puzzle"
            className="group rounded-xl p-4 border border-slate-200 bg-white shadow-sm flex justify-between items-center hover:border-amber-300 hover:shadow-md hover:shadow-amber-100/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 rounded-lg p-2">
                <Puzzle className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                Daily Puzzles
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-emerald-600 border-emerald-200"
            >
              Beta
            </Badge>
          </Link>
        </div>
      </div>
    </>
  );
}
