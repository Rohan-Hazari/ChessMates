import axios from "axios";

export async function POST(req: Request, res: Response) {
  const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

  const body = await req.json();

  const { data } = await axios.post(
    ` https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${body.token}`
  );

  if (data.success) {
    return new Response("Verification Success", { status: 200 });
  }
  return new Response("Invalid token", { status: 403 });
}
