import axios from "axios";

export async function GET(req: Request) {
  // REFER TO editorjs docs
  //https:github.com/editor-js/link
  try {
    const url = new URL(req.url);

    const href = url.searchParams.get("url");

    if (!href) {
      return new Response("Invalid href", { status: 400 });
    }

    const res = await axios.get(href, { timeout: 5000 });

    const titleMatch = res.data.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "";

    const descriptionMatch = res.data.match(
      /<meta name="description" content="(.*?)"/
    );
    const description = descriptionMatch ? descriptionMatch[1] : "";

    const imageMatch = res.data.match(
      /<meta property = " og:image" content="(.*?)"/
    );
    const imageUrl = imageMatch ? imageMatch[1] : "";

    return new Response(
      JSON.stringify({
        success: 1,
        meta: {
          title,
          description,
          image: {
            url: imageUrl,
          },
        },
      })
    );
  } catch (error) {
    console.log(error);

    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      return new Response("Request timed out", { status: 504 });
    }

    return new Response("An error occurred", { status: 500 });
  }
}
