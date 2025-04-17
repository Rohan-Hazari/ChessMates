import { authOptions, getAuthSession } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

export default async function CommunityProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect(authOptions.pages?.signIn ?? "/login");
  }
  return <div>{children}</div>;
}
