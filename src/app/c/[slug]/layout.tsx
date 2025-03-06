import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import SubscribeToggle from "@/components/SubscribeToggle";
import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";
import { Pencil } from "lucide-react";
import BackButton from "@/components/CommunityBackButton";
import DynamicLink from "@/components/ui/DynamicLink";
import { getSessionFromRequest } from "@/lib/session";

const Layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  const session = await getSessionFromRequest()

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

  // !! operator turns any value into boolean based on whether its truth or falsy
  const isSubscribed = !!subscription;

  if (!community) notFound();
  const memberCount = await db.subscription.count({
    where: {
      community: {
        name: slug,
      },
    },
  });

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-0">
      <div>
        {/* button to take back */}
        <BackButton />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>

          {/* sidebar */}

          <aside className="hidden md:block overflow-hidden bg-white h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="px-6 pt-4">
              <div className="font-semibold py-3 flex justify-between items-center">
                <p>About {community.name}</p>
                {/* Edit description for creator  */}
                {community.creatorId === session?.user.id ? (
                  <Link
                    title="Edit description"
                    className="hover:bg-gray-300 rounded-md transition-colors "
                    href={`/c/${slug}/edit-description`}
                  >
                    <Pencil className="w-5 h-5 hover:cursor-pointer m-2 " />
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="px-6  border-b-2 border-gray-200">
              <p className="font-light pb-3 text-sm">
                {!!community.description === false
                  ? "No description"
                  : community.description}
              </p>
            </div>

            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={community.createdAt.toDateString()}>
                    {format(community.createdAt, "MMMM d, yyyy")}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="text-gray-900">{memberCount}</dd>
              </div>
              {community.creatorId === session?.user.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-orange-500">You created this community</p>
                </div>
              ) : null}

              {community.creatorId !== session?.user.id ? (
                <SubscribeToggle
                  communityId={community.id}
                  communityName={community.name}
                  isSubscribed={isSubscribed}
                />
              ) : null}
              {isSubscribed || session?.user ? (
                <DynamicLink
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full mb-6",
                  })}
                  slug={slug}
                >
                  Create Post
                </DynamicLink>
              ) : null}
            </dl>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Layout;
