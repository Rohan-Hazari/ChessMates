"use client";

import React, { useState, FormEvent } from "react";
import { Button } from "./ui/Button";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/Input";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { UserPayload } from "@/lib/validators/user";
import { z } from "zod";

// this will make the component like a div so now we can pass any props to it earlier we could only pass key
// interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement>{}

const RegisterUserAuthForm = () => {
  const [input, setInput] = useState({ email: "", password: "", name: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const signupWithGoogle = async () => {
    setIsLoading(true);

    try {
      const res = await signIn("google");
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

  const { mutate: signupWithCredentials } = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const payload: UserPayload = {
        name: input.name,
        email: input.email,
        password: input.password,
      };

      const { data } = await axios.post("/api/register", payload);

      return data as string;
    },
    onError: (error) => {
      console.log(error);

      setIsLoading(false);
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          const reason =
            error.response?.statusText === "emailConflict" ? "email" : "name";

          toast({
            title: `User ${reason} already exists`,
            description: `User with this ${reason} already exists`,
            variant: "default",
          });
        }
        if (error.response?.status === 422) {
          toast({
            title: "Invalid Input",
            description:
              "Please check your username has no space and try again",
            variant: "destructive",
          });
        }
      } else if (error instanceof z.ZodError) {
        toast({
          title: "Invalid Input",
          description: "Please check your username has no space and try again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Could not sign up",
          description: "Something went wrong, please try again later",
          variant: "destructive",
        });
      }
    },
    onSuccess: (data) => {
      setIsLoading(false);

      toast({
        title: "New user created",
        description: "User created successfully",
        variant: "success",
      });
      setTimeout(() => {
        router.push("/sign-in");
      }, 1000);
    },
  });

  return (
    <div className="flex flex-col gap-y-6">
      <form className="flex flex-col gap-y-6 ">
        <div className="text-left">
          <label className="text-red-500 text-xs text-left" htmlFor="username">
            Spaces are not allowed in username
          </label>
          <Input
            placeholder="Username"
            type="text"
            id="username"
            onChange={(e) => {
              setInput((prevInput) => ({ ...prevInput, name: e.target.value }));
            }}
          />
        </div>
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
          onClick={() => signupWithCredentials()}
          isLoading={isLoading}
          size="sm"
          className="w-full"
        >
          {isLoading}
          Sign Up
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
          onClick={signupWithGoogle}
          isLoading={isLoading}
          size="sm"
          className="w-full"
        >
          {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
          Sign-Up with Google
        </Button>
      </div>
    </div>
  );
};

export default RegisterUserAuthForm;
