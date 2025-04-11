"use client";

import { useToast } from "@/hooks/use-toast";
import { SignInUserValidator } from "@/lib/validators/user";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { z } from "zod";
import { Icons } from "./Icons";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

// this will make the component like a div so now we can pass any props to it earlier we could only pass key
// interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement>{}

const UserAuthForm = () => {
  const [input, setInput] = useState({ name: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCaptchaVerified, setCaptchaVerified] = useState<boolean>(false);
  const recaptcha = useRef<ReCAPTCHA | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: loginWithGoogle } = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      await signIn("google");
    },
    onError: (error) => {
      setIsLoading(false);
      return toast({
        title: "There was a problem",
        description: "There was an error logging in with Google",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setIsLoading(false);
    },
  });

  const { mutate: loginWithCredentials } = useMutation({
    mutationFn: async () => {
      setIsLoading(true);

      const { name, password } = SignInUserValidator.parse({
        name: input.name,
        password: input.password,
      });

      const res = await signIn("credentials", {
        name: name,
        password: password,
        redirect: false,
      });
      // when redirect is false the error params is added in res if its true res is undefined
      // console.log("one", res?.error);

      return res;
    },
    onError: (error) => {
      setIsLoading(false);
      if (error instanceof z.ZodError) {
        return toast({
          title: "Invalid Input Format",
          description: "Make sure there are no spaces in input",
          variant: "destructive",
        });
      } else {
        return toast({
          title: "Could not sign in",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    },
    onSuccess: (data) => {
      setIsLoading(false);

      if (data?.error === "InvalidCredentials") {
        return toast({
          title: "Invalid credentials",
          description:
            "Please check your if your name and password is correct and try again",
          variant: "destructive",
        });
      } else if (data?.error === "UserNotFound") {
        return toast({
          title: "User Not Found",
          description: "No such user exists",
          variant: "destructive",
        });
      } else if (data?.error === "InvalidPassword") {
        return toast({
          title: "Invalid Password",
          description: "Please check your password and try again",
          variant: "destructive",
        });
      } else {
        router.refresh();
        setTimeout(() => {
          router.push("/");
        }, 2000);
        return toast({
          title: "Sign in succesfull",
          description: "Redirecting....",
          variant: "success",
        });
      }
    },
  });

  const handleCaptchaChange = async (token: string | null) => {
    if (token) {
      try {
        const response = await axios.post("/api/captcha-verify", { token });
        if (response.status === 200) {
          setCaptchaVerified(true);
        }
      } catch (error) {
        setCaptchaVerified(false);
        toast({
          title: "Internal server Error",
          description: "CAPTCHA Verification error,Please try again",
          variant: "destructive",
        });
      }
    }
  };

  const handleExpiredCaptcha = () => {
    setCaptchaVerified(false);
  };

  return (
    <div className="flex flex-col gap-y-6">
      <form className="flex flex-col gap-y-6 ">
        <Input
          placeholder="Username"
          type="text"
          onChange={(e) => {
            setInput((prevInput) => ({ ...prevInput, name: e.target.value }));
          }}
        />

        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => {
            setInput((prevInput) => ({
              ...prevInput,
              password: e.target.value,
            }));
          }}
        />
        <ReCAPTCHA
          ref={recaptcha}
          onChange={handleCaptchaChange}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
          onExpired={handleExpiredCaptcha}
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
            loginWithCredentials();
          }}
          disabled={!isCaptchaVerified || isLoading}
          isLoading={isLoading}
          size="sm"
          className="w-full"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
      <div className="relative flex flex-col justify-center">
        <p
          className="absolute m-auto left-1/2 -translate-x-1/2 bg-white p-2 w-10
         text-center text-sm text-zinc-600"
        >
          OR
        </p>
        <hr className="" />
      </div>
      <div className="flex justify-center">
        <Button
          onClick={() => loginWithGoogle()}
          disabled={!isCaptchaVerified || isLoading}
          isLoading={isLoading}
          size="sm"
          className="w-full"
        >
          {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
          Sign In with Google
        </Button>
      </div>
    </div>
  );
};

export default UserAuthForm;
