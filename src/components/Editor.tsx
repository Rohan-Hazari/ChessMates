"use client";
import dynamic from "next/dynamic";
import { FC } from "react";
import { toast } from "@/hooks/use-toast";
import EditorErrorBoundary from "@/components/EditorErrorBoundary";

const EditorMain = dynamic(() => import("./EditorMain"), {
  loading: () => (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border-[1px] border-zinc-200">
      Loading editor...
    </div>
  ),
  ssr: false,
});

interface EditorProps {
  communityId: string;
  buttonId: string;
}

const Editor: FC<EditorProps> = ({ communityId, buttonId }) => {
  return (
    <EditorErrorBoundary>
      <EditorMain communityId={communityId} buttonId={buttonId} />
    </EditorErrorBoundary>
  );
};

export default Editor;
