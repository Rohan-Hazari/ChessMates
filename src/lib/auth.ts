import { NextAuthOptions, getServerSession } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db } from "./db";
import { cache } from "react";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
    // signOut: "/auth/signout",
    // newUser: "/auth/new-user",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.name || !credentials?.password) {
          throw new Error("InvalidCredentials");
        }

        const user = await db.user.findFirst({
          where: {
            name: credentials.name,
          },
        });

        if (!user || !user.password) {
          throw new Error("UserNotFound");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("InvalidPassword");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    //  When using the Credentials Provider the user object is the response returned from the authorize callback and the profile object is the raw body of the HTTP POST submission.
    // https://next-auth.js.org/configuration/callbacks#session-callback
    // order: authorize -> jwt -> session
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
      }

      return session;
    },
    // controls the content of the JWT
    // user : This object typically contains the user's information as received from the identity provider (like Google, Facebook, etc.)
    async jwt({ token, user, account }) {
      //find dbUser where email = token.email
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      // if there is no user in our db yet
      if (!dbUser) {
        if (user) {
          token.id = user.id;
          // If it's a Google login, remove spaces from the name
          if (account?.provider === "google") {
            token.name = user.name?.replace(/\s+/g, "");
            await db.user.update({
              where: { id: user.id },
              data: { name: token.name },
            });
          }
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
      // This data is then available in the session callback
      // and then on client-side via getSession or useSession
    },
    redirect({ url, baseUrl }) {
      // Handle the Google authentication callback
      if (url.startsWith("/api/auth/callback/google")) {
        return baseUrl;
      }
      if (url.includes("/sign-in")) {
        return baseUrl;
      }
      // If the url starts with '/', it's a relative url, so we prefix it with the baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If the url starts with http or https, it's an absolute url, so we return it as-is
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser && account?.provider === "google") {
        await db.user.update({
          where: { id: user.id },
          data: {
            name: user.name?.replace(/\s+/g, ""),
          },
        });
      }
    },
    async createUser({ user }) {
      // You can perform additional actions when a new user is created
      // TODO Verification
    },
  },
};

export const getAuthSession = cache(async () => {
  const session = await getServerSession(authOptions);
  return session;
});
