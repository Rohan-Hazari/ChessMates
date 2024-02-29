"use client";

import { Input } from "@/components/ui/Input";
import { Button, buttonVariants } from "@/components/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateCommunityPayload } from "@/lib/validators/community";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

const Page = () => {
  const [input, setInput] = useState({ name: "", desc: "" });
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateCommunityPayload = {
        name: input.name,
        description: input.desc,
      };
      const { data } = await axios.post("/api/community", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Community already exists",
            description: "Please try another name",
            variant: "destructive",
          });
        }
        if (err.response?.statusText === "Description too long") {
          return toast({
            title: "Description too long",
            description: "Please keep it under 500 characters",
            variant: "destructive",
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: "Invalid community name",
            description:
              "Please choose a name between 3 and 21 characters and do not add any spaces",
            variant: "destructive",
          });
        }
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: "An error occurred",
        description: "Please try again",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Community Created",
        description: `Community named ${data} was created`,
        variant: "success",
      });
      router.push(`c/${data}`);
    },
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <form className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a Community</h1>
        </div>

        <hr className="bg-zinc-500 h-px" />

        <div className="flex flex-col divide-y-2 divide-gray-200 gap-y-6">
          <div className="relative flex flex-col gap-y-6">
            <div>
              <p className="text-lg font-medium">Name</p>
              <p className="text-sm">
                Community names including capitalization cannot be changed.
              </p>
              <p className="text-xs text-red-600">
                (Space is not allowed in the name)
              </p>
            </div>
            <Input
              pattern="^[^\\s]*$"
              required={true}
              value={input.name}
              onChange={(e) =>
                setInput((prevInput) => ({
                  ...prevInput,
                  name: e.target.value,
                }))
              }
              className=" pl-6"
              placeholder="Eg: NimzoIndian , Indian_Chess, Queens-Gambit"
            />
          </div>
          <div className="relative flex flex-col gap-y-6 pt-6 ">
            <div>
              <p className="text-lg font-medium">Description</p>
              <p className="text-sm ">
                Write a small description about your community.
              </p>
              <p className="text-xs ">Keep it less than 50 words</p>
            </div>
            <textarea
              required={true}
              value={input.desc}
              onChange={(e) =>
                setInput((prevInput) => ({
                  ...prevInput,
                  desc: e.target.value,
                }))
              }
              className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent
               file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
               focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-6"
              placeholder="Community description..."
            />
          </div>
        </div>
        <div className=" flex justify-end gap-4">
          <Button variant="subtle" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.name.length === 0}
            onClick={() => {
              createCommunity();
            }}
          >
            Create Community
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
