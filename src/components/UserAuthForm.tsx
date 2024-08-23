"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/Input";
import { z } from "zod";
import { SignInUserValidator } from "@/lib/validators/user";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

// this will make the component like a div so now we can pass any props to it earlier we could only pass key
// interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement>{}

const UserAuthForm = () => {
  const [input, setInput] = useState({ name: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname()


  const { mutate: loginWithGoogle } = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      await signIn("google");
    },
    onError: (error) => {
      toast({
        title: "There was a problem",
        description: "There was an error logging in with Google",
        variant: "destructive",
      });
      setIsLoading(false)
    },
    onSuccess: () => {
      setIsLoading(false);

    },
  })

  const { mutate: loginWithCredentials } = useMutation({
    mutationFn: async () => {
      setIsLoading(true)

      const { name, password } = SignInUserValidator.parse({
        name: input.name,
        password: input.password,
      });

      const res = await signIn("credentials", {
        name: name,
        password: password
      });

      return res
    },
    onError: (error) => {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid Input Format",
          description: "Make sure there are no spaces in input",
          variant: "destructive",
        });
      }
      else {
        toast({
          title: "Could not sign in",
          description: "Please try again later",
          variant: "destructive",
        });
      }

      setIsLoading(false)

    },
    onSuccess: (data) => {

      const error = searchParams ? searchParams.get('error') : null
      if (error) {
        switch (error) {
          case "CredentialsSignin":
            toast({
              title: "Invalid credentials",
              description: "Please check your input and try again",
              variant: "destructive",
            });
          default:
            toast({
              title: "Could not sign in",
              description: "Please try again later",
              variant: "destructive",
            });

        }
      }

      setIsLoading(false)
    }
  })



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
