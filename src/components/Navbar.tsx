import Link from "next/link";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import SearchBar from "./SearchBar";
import { Crown, Compass } from "lucide-react";

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <div className="fixed top-0 inset-x-0 h-fit min-h-[60px] bg-white/80 backdrop-blur-lg border-b border-slate-200/80 z-[10] py-2 shadow-sm">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex gap-2 items-center group">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-1.5 rounded-lg shadow-sm shadow-amber-200/50 group-hover:shadow-amber-300/60 transition-shadow">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <p className="hidden text-slate-800 text-sm font-bold md:block tracking-tight">
            ChessMates
          </p>
        </Link>

        <div className="flex items-center gap-4 flex-1 justify-center max-w-xl">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/landing"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-amber-600 transition-colors px-3 py-2 rounded-lg hover:bg-amber-50"
          >
            <Compass className="w-4 h-4" />
            <span>About</span>
          </Link>

          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <Link
              href="/sign-in"
              className={buttonVariants({
                className:
                  "text-xs sm:text-sm min-w-fit bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-sm shadow-amber-200/50",
              })}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
