"use client";

import { BookPlus } from "lucide-react";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/Button";
import { useCustomToast } from "@/hooks/use-custom-toast";

interface CreatePostProps {
  session: Session | null;
}

const CreatePost: FC<CreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { loginToast } = useCustomToast();
  const handleClick = (route: string) => {
    if (!session) {
      loginToast();
    } else {
      router.push(pathname + `/${route}`);
    }
  };
  return (
    <div className="overflow-hidden rounded-md bg-white shadow">
      <div className="relative h-full px-8 py-6 flex justify-between gap-6 ">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user?.name || null,
              image: session?.user?.image || null,
            }}
          />
          <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline-2 outline-white " />
        </div>

        <Button
          onClick={() => handleClick("submit")}
          variant="outline"
          className="flex-1"
        >
          Create Post
        </Button>

        <div className="relative gap-y-4 group">
          <Button
            onClick={() => handleClick("puzzle-submit")}
            variant="ghost"
            className=""
          >
            <BookPlus className="text-zinc-600" />
          </Button>
          <div className="absolute top-10 -left-[70%] bg-black text-center text-slate-200 p-1 rounded-sm h-5 w-32 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
            Create Chess Post
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
