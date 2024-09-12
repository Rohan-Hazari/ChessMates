"use client";
import { useMutation } from "@tanstack/react-query";
import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { SubscribeToCommunityPayload } from "@/lib/validators/community";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface SubscribeToggleProps {
  communityId: string;
  communityName: string;
  isSubscribed: boolean;
}

const SubscribeToggle: FC<SubscribeToggleProps> = ({
  communityId,
  communityName,
  isSubscribed,
}) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();
  const { data: session } = useSession();

  const { mutate: subscribe, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToCommunityPayload = {
        communityId,
      };
      const { data } = await axios.post("/api/community/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
        if (err.response?.status === 400) {
          return toast({
            title: "Already subscribed",
            description: "You are already subscribed to this community",
            variant: "default",
          });
        }
      }
      return toast({
        title: "An error occured",
        description: "Something went wrong, please try again",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "Subscribed",
        description: `You have joined the ${communityName} community`,
        variant: "success",
      });
    },
  });

  const { mutate: unSubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToCommunityPayload = {
        communityId,
      };
      const { data } = await axios.post("/api/community/unsubscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
        if (err.response?.status === 400) {
          return toast({
            title: "Not subscribed",
            description: "You are not subscribed to this community",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "An error occured",
        description: "Something went wrong, please try again",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "Unsubscribed",
        description: `You have left the ${communityName} community`,
        variant: "default",
      });
    },
  });

  return isSubscribed ? (
    <Button
      disabled={!session}
      onClick={() => unSubscribe()}
      isLoading={isUnsubLoading}
      className="w-full mt-1 mb-4"
    >
      Leave community
    </Button>
  ) : (
    <Button
      disabled={!session}
      isLoading={isLoading}
      onClick={() => subscribe()}
      className="w-full mt-1 mb-4"
    >
      Join to post
    </Button>
  );
};

export default SubscribeToggle;
