"use client";
import { useMutation } from "@tanstack/react-query";
import { FC } from "react";
import { Button } from "./ui/Button";
import { SubscribeToCommunityPayload } from "@/lib/validators/community";
import axios from "axios";

interface SubscribeToggleProps {
  communityId: string;
}

const SubscribeToggle: FC<SubscribeToggleProps> = ({ communityId }) => {
  const isSubscribed = false;

  const {} = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToCommunityPayload = {
        communityId,
      };
      const { data } = await axios.post("api/community/subscribe", payload);
      return data as string;
    },
  });

  return isSubscribed ? (
    <Button className="w-full mt-1 mb-4">Leave community</Button>
  ) : (
    <Button className="w-full mt-1 mb-4">Join to post</Button>
  );
};

export default SubscribeToggle;
