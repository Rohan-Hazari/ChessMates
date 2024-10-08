import Link from "next/link";
import { Icons } from "./Icons";
import RegisterUserAuthForm from "./RegisterUserAuthForm";

const SignUp = () => {
  return (
    <div className=" container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">

        <h1 className="flex justify-center items-center text-2xl font-semibold tracking-tight">Sign Up <Icons.logo className="m-2 h-6 w-6" /></h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing you are setting up a ChessMates account and agree to our
          User Agreement and Privacy Policy
        </p>

        <RegisterUserAuthForm />

        <p className="px-8 text-center text-sm text-zinc-700">
          Already a ChessMater?{" "}
          <Link
            href="/sign-in"
            className="hover:text-zinc-800 px-2 text-sm underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
