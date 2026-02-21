import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import SubscribeToggle from "@/components/SubscribeToggle";
import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";
import { Pencil, Calendar, Users, Crown } from "lucide-react";
import BackButton from "@/components/CommunityBackButton";
import DynamicLink from "@/components/ui/DynamicLink";
import { getAuthSession } from "@/lib/auth";

export default async function Layout({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const session = await getAuthSession();

  const community = await db.community.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
    take: 10,
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          community: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  if (!community) notFound();

  const memberCount = await db.subscription.count({
    where: {
      community: {
        name: slug,
      },
    },
  });

  const isCreator = community.creatorId === session?.user?.id;

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-0">
      <div>
        <BackButton />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-6 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>

          {/* Sidebar */}
          <aside className="hidden md:flex flex-col gap-4 h-fit order-first md:order-last">
            {/* Community Info Card */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white text-sm flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    About {community.name}
                  </p>
                  {isCreator && (
                    <Link
                      title="Edit description"
                      className="text-white/80 hover:text-white transition-colors"
                      href={`/c/${slug}/edit-description`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="px-6 py-4 border-b border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {community.description || "No description yet."}
                </p>
              </div>

              {/* Stats */}
              <div className="px-6 py-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-4 h-4" />
                    Created
                  </span>
                  <time
                    dateTime={community.createdAt.toDateString()}
                    className="text-slate-700 font-medium"
                  >
                    {format(community.createdAt, "MMM d, yyyy")}
                  </time>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Users className="w-4 h-4" />
                    Members
                  </span>
                  <span className="text-slate-700 font-medium">
                    {memberCount}
                  </span>
                </div>

                {isCreator && (
                  <div className="bg-amber-50 rounded-lg px-3 py-2 text-center">
                    <p className="text-xs font-medium text-amber-700">
                      You created this community
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 pb-5 space-y-2">
                {!isCreator && (
                  <SubscribeToggle
                    communityId={community.id}
                    communityName={community.name}
                    isSubscribed={isSubscribed}
                  />
                )}
                {(isSubscribed || session?.user) && (
                  <DynamicLink
                    className={buttonVariants({
                      variant: "outline",
                      className: "w-full",
                    })}
                    slug={slug}
                  >
                    Create Post
                  </DynamicLink>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
