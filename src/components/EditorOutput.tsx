"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FC } from "react";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  }
);

interface EditorOutputProps {
  content: any;
}

const CustomHeaderRenderer = ({ data }: any) => {
  const content = data.text;
  return <p className="text-lg font-extrabold">{content}</p>;
};

const CustomImageRenderer = ({ data }: any) => {
  const src = data.file.url;

  return (
    <div className="relative flex justify-center items-center max-w-[20rem]  lg:max-w-[25rem]  ">
      <Image
        alt="image"
        className="object-renderer"
        style={{ objectFit: "cover" }}
        width={700}
        height={400}
        src={src}
      />
    </div>
  );
};

const renderers = {
  image: CustomImageRenderer,
  header: CustomHeaderRenderer,
};

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      data={content}
      style={style}
      className="text-sm"
      renderers={renderers}
    />
  );
};

export default EditorOutput;
