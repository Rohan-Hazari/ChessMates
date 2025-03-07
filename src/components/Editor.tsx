"use client";
import dynamic from "next/dynamic";
import { FC } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

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
const renderEditorError = (
  <div className="editor-error">
    <h3>Sorry, there was a problem loading the editor.</h3>
  </div>
);

const Editor: FC<EditorProps> = ({ communityId, buttonId }) => {
  return (
    <ErrorBoundary fallback={renderEditorError}>
      <EditorMain communityId={communityId} buttonId={buttonId} />
    </ErrorBoundary>
  );
};

export default Editor;
