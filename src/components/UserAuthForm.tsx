"use client";

import React, { useState } from "react";
import { Button } from "./ui/Button";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/Input";
import { z } from "zod";
import { UserValidator } from "@/lib/validators/user";
import { useRouter } from "next/navigation";

// this will make the component like a div so now we can pass any props to it earlier we could only pass key
// interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement>{}

const UserAuthForm = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      const res = await signIn("google");
      console.log(res);
    } catch (error) {
      toast({
        title: "There was a problem",
        description: "There was an error logging in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithCredentials = async () => {
    setIsLoading(true);

    try {
      const { email, password } = UserValidator.parse({
        email: input.email,
        password: input.password,
      });

      const res = await signIn("credentials", {
        email: email,
        password: password,
      });
      console.log(res);

      if (res?.error) {
        switch (res.error) {
          case "CredentialsSignin":
            return toast({
              title: "Invalid credentials",
              description: "Please check your input and try again",
              variant: "destructive",
            });
          default:
            return toast({
              title: "Could not sign in",
              description: "Please try again later",
              variant: "destructive",
            });
        }
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      if (error instanceof z.ZodError) {
        return toast({
          title: "Invalid Input Format",
          description: "Please check your input and try again",
          variant: "destructive",
        });
      }

      return toast({
        title: "Could not sign in",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-y-6">
      <form className="flex flex-col gap-y-6 ">
        <Input
          placeholder="Email"
          type="email"
          onChange={(e) => {
            setInput((prevInput) => ({ ...prevInput, email: e.target.value }));
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
        <Button
          onClick={(e) => {
            e.preventDefault();
            loginWithCredentials();
          }}
          isLoading={isLoading}
          size="sm"
          className="w-full"
        >
          {isLoading}
          Sign In
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
