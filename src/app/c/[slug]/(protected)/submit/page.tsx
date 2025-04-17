import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Editor from "@/components/Editor";
import { getAuthSession } from "@/lib/auth";

interface pageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: pageProps) => {
  const session = await getAuthSession();
  const community = await db.community.findFirst({
    where: {
      name: params.slug,
    },
  });

  if (!community) return notFound();

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          community: {
            name: params.slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  // !! operator turns any value into boolean based on whether its truth or falsy
  const isSubscribed = !!subscription;

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <p className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </p>
          <p className="ml-1 mt-1 truncate font-semibold text-sm text-gray-900">
            in {params.slug}
          </p>
        </div>
      </div>

      {/* form */}
      <Editor communityId={community.id} buttonId="postBtnId" />

      <div className="w-full flex justify-end">
        {/* check subscription and disable button*/}
        <Button
          id="postBtnId"
          disabled={!isSubscribed}
          type="submit"
          className="w-full"
          form="community-post-form"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default page;
