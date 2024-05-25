import { db } from "@/lib/db";
import { SignUpUserValidator } from "@/lib/validators/user";
import { hash } from "bcrypt";
import { nanoid } from "nanoid";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = SignUpUserValidator.parse(body);

    //find if there exists a user with given email
    const userExists = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userExists) {
      return new Response("User already exists", { status: 409 });
    }

    const hashedPassword = await hash(password, 10);
    // create a new user
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username: nanoid(10),
      },
    });

    return new Response(JSON.stringify(newUser), {
      status: 201,
      statusText: "New user created",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data ", { status: 422 });
    }
    return new Response("Could not sign up, please try again later", {
      status: 500,
    });
  }
}
