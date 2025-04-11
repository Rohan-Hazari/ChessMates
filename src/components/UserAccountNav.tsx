"use client";

import { User } from "next-auth";
import { FC } from "react";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
// refer shadcn docs dont waste time on understanding the code
import { signOut } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface UserAccountNavProps {
  user: Pick<User, "name" | "email" | "image">;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  const { toast } = useToast();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <UserAvatar
          className="h-8 w-8  "
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col spacy-y-1 leading-none ">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/c/create">Create Community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={async (event) => {
            //   event.preventDefault();
            await signOut({
              // callbackUrl: "/sign-in",
            });

            toast({
              title: "Signed out succesfully",
              variant: "warning",
            });
          }}
          className="cursor-pointer"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
