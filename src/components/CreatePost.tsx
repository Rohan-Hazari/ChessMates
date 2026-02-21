"use client";

import { BookPlus, PenLine } from "lucide-react";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/Button";
import { useCustomToast } from "@/hooks/use-custom-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

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
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="relative h-full px-4 sm:px-6 py-4 flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <UserAvatar
            user={{
              name: session?.user?.name || null,
              image: session?.user?.image || null,
            }}
          />
          <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-emerald-500 ring-2 ring-white" />
        </div>

        <Button
          onClick={() => handleClick("submit")}
          variant="outline"
          className="flex-1 justify-start text-slate-400 hover:text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
        >
          <PenLine className="w-4 h-4 mr-2 text-slate-400" />
          Create Post
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handleClick("puzzle-submit")}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              >
                <BookPlus className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create Chess Puzzle</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CreatePost;
