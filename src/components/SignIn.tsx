import Link from "next/link";
import { Icons } from "./Icons";
import UserAuthForm from "./UserAuthForm";

const SignIn = () => {
  return (
    <div className=" container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">

        <h1 className="flex justify-center items-center text-2xl font-semibold tracking-tight">Sign In to Chessmates <Icons.logo className="m-2 h-6 w-6" /> </h1>

        {/* Form */}
        <UserAuthForm />

        <p className="px-8 text-center text-sm text-zinc-700">
          New to ChessMates?{""}
          <Link
            href="/sign-up"
            className="hover:text-zinc-800 px-2 text-sm underline underline-offset-4"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
