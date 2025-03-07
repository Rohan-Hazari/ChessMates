"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import type EditorJS from "@editorjs/editorjs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface EditorTools {
  EditorJS: typeof EditorJS;
  Header: any;
  Embed: any;
  List: any;
  LinkTool: any;
  ImageTool: any;
  InlineCode: any;
}

interface EditorMainProps {
  communityId: string;
  buttonId: string;
}

const loadEditorTools = async (): Promise<EditorTools> => {
  const [EditorJS, Header, Embed, List, LinkTool, InlineCode, ImageTool] =
    await Promise.all([
      import("@editorjs/editorjs").then((m) => m.default),
      import("@editorjs/header").then((m) => m.default),
      import("@editorjs/embed").then((m) => m.default),
      import("@editorjs/list").then((m) => m.default),
      import("@editorjs/link").then((m) => m.default),
      import("@editorjs/inline-code").then((m) => m.default),
      import("@editorjs/image").then((m) => m.default),
    ]);

  return {
    EditorJS,
    Header,
    Embed,
    List,
    LinkTool,
    ImageTool,
    InlineCode,
  };
};

const EditorMain = ({ communityId, buttonId }: EditorMainProps) => {
  const [editorTools, setEditorTools] = useState<EditorTools | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      communityId,
      title: "",
      content: null,
    },
  });

  const initializeEditor = useCallback(async () => {
    if (!editorTools) {
      const tools = await loadEditorTools();
      setEditorTools(tools);
    }

    if (!ref.current && editorTools) {
      const editor = new editorTools.EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Write your post here....",
        data: { blocks: [] },
        inlineToolbar: true,
        tools: {
          header: editorTools.Header,
          // https://github.com/editor-js/link
          linkTool: {
            class: editorTools.LinkTool,
            config: {
              // basically when there is a link in the content this api will fetch the meta data of the link
              endpoint: "/api/link",
            },
          },
          image: {
            class: editorTools.ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles("imageUploader", {
                    files: [file],
                  });
                  return {
                    success: 1,
                    file: {
                      url: res.url,
                    },
                  };
                },
              },
            },
          },
          list: editorTools.List,
          inlineCode: editorTools.InlineCode,
          embed: editorTools.Embed,
        },
      });
    }
  }, [editorTools]);

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      communityId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        title,
        content,
        communityId,
      };
      const res = await axios.post("/api/community/post/create", payload);
      return res.data;
    },
    onError: () => {
      //later add not subscribed to this community error
      toast({
        title: "Something went wrong",
        description: "Your post was not published, please try again later",
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      const newPathname = pathname.split("/").slice(0, -1).join("/"); // c/community/submit to c/community
      await router.push(newPathname);
      toast({
        title: "Post published",
        variant: "success",
      });
      setTimeout(() => {
        router.refresh();
      }, 500);
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save();

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      communityId,
    };

    const button = document.getElementById(buttonId) as HTMLButtonElement;
    if (button) {
      button.disabled = true;
    }

    createPost(payload);
  }

  if (!isMounted) {
    return null;
  }

  const { ref: titleRef, ...rest } = register("title");

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border-[1px] border-zinc-200">
      <form
        id="community-post-form"
        className="w-fit"
        // https://react-hook-form.com/docs/useform/handlesubmit
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              // @ts-ignore
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
          {editorTools ? (
            <div id="editor" className="min-h-[500px]" />
          ) : (
            <div className="min-h-[500px] flex items-center justify-center">
              <div className="animate-pulse">Loading editor...</div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditorMain;
