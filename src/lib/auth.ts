import { NextAuthOptions, getServerSession } from "next-auth";
import { db } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter"; // https://authjs.dev/reference/adapter/prisma
import GoogleProvider from "next-auth/providers/google";
import { nanoid } from "nanoid";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    // https://next-auth.js.org/configuration/options#session
    // basically how to save this session jwt(default stored in session cooki) or in database
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // https://next-auth.js.org/configuration/callbacks#session-callback
    //when a session is created what should happen =>
    //checks if a token exists and if it does it adds the user information from the token to the session
    // token is the JWT that was set in the user's browser when they logged in.
    async session({ token, session }) {
      // session is inititally populated by nextAuth.js with default valuex
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      return session;
    },
    // controls the content of the JWT
    // user : This object typically contains the user's information as received from the identity provider (like Google, Facebook, etc.)
    async jwt({ token, user }) {
      //find dbUser where email = token.email
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      // if there is no user in our db yet
      if (!dbUser) {
        token.id = user!.id;
        return token;
      }
      // if there is a user in our db but no username
      if (!dbUser.username) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: nanoid(10),
          },
        });
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      };
      // This data is then available in the session callback
      // and on the client-side via getSession or useSession
    },
    redirect() {
      return "/";
    },
  },
};

// as of 30/7/23  getServerSession is still experimental
// When a user logs in, NextAuth.js creates a session for that user.
// In the context of NextAuth.js, a "session" represents the state of a user's current interaction with your application.
// the following helper function is used to get the session of the user
export const getAuthSession = () => getServerSession(authOptions);
