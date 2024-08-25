"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { CreateCommunityPayload } from "@/lib/validators/community";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = ({ params: slug }: { params: { slug: string } }) => {
  const communityName = slug.slug;
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: editCommunityDescription, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateCommunityPayload = {
        name: communityName,
        description: description,
      };
      const { data } = await axios.put(
        "/api/community/edit-description",
        payload
      );

      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (
          err.response?.status === 422 &&
          err.response?.statusText === "Description too long"
        ) {
          return toast({
            title: "Description too long",
            description: "Please keep it under 500 characters",
            variant: "destructive",
          });
        }
        if (err.response?.status === 404) {
          return toast({
            title: "Community does not exist",
            description: "Please try again",
            variant: "destructive",
          });
        }

        if (
          err.response?.status === 401 &&
          err.response?.statusText === "Not logged in"
        ) {
          return loginToast();
        }
        if (
          err.response?.status === 401 &&
          err.response?.statusText ===
          "You are not the creator of this community"
        ) {
          return toast({
            title: "Unauthorized",
            description: "You are not the creator of this community",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "An error occurred",
        description: "Please try again",
        variant: "destructive",
      });
    },
    onSuccess: async (data) => {
      toast({
        title: "Community description updated",
        description: `${data}'s description was updated`,
        variant: "success",
      });

      router.push(`/c/${data}`);
      // instantly shows the updated description
      router.refresh();
    },
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Edit {communityName}&apos;s community description
          </h1>
        </div>

        <hr className="bg-zinc-500 h-px" />

        <div className="flex flex-col divide-y-2 divide-gray-200 gap-y-6">
          <div className="relative flex flex-col gap-y-2">
            <div>
              <p className="text-lg font-medium">Name</p>
            </div>
            <Input disabled className=" pl-6" placeholder={communityName} />
          </div>
          <div className="relative flex flex-col gap-y-6 pt-6 ">
            <div>
              <p className="text-lg font-medium">Description</p>
              <p className="text-sm ">
                Write a small description about your community.
              </p>
              <p className="text-xs ">Keep it less than 60 words</p>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent
               file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
               focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-6"
              placeholder="Community description..."
            />
          </div>
        </div>
        <div className=" flex justify-end gap-4">
          <Button
            variant="subtle"
            onClick={() => router.push(`c/${communityName}`)}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            variant="success"
            onClick={(e) => {
              editCommunityDescription(), e.preventDefault();
            }}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
