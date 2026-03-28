import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { Adapter } from "next-auth/adapters";

function generateUsername(email: string) {
  return (
    email.split("@")[0] +
    "_" +
    Math.floor(1000 + Math.random() * 9000)
  );
}

const config = {
  debug: true,
  trustHost: true,

  // Cast to Adapter to avoid skew between @auth/core and next-auth types
  adapter: PrismaAdapter(prisma) as Adapter,

  session: {
    strategy: "jwt",
  },

  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) return null;

        // Must match your augmented User type (id, username, etc.)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          username: user.username,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    // 🔥 HANDLE OAUTH + USERNAME GUARANTEE
    async signIn({ user, account }) {
      if (!user.email) return true;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      // 🧠 If user exists → ensure username exists
      if (existingUser) {
        if (!existingUser.username) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              username: generateUsername(user.email),
            },
          });
        }

        // 🔗 Link OAuth account if needed
        if (account?.provider !== "credentials" && account) {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {},
            create: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              id_token: account.id_token,
              scope: account.scope,
              token_type: account.token_type,
            },
          });
        }

        (user as any).id = existingUser.id;
      }

      // 🆕 If new user → create with username
      else {
        const newUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            username: generateUsername(user.email), // ✅ REQUIRED
          },
        });

        (user as any).id = newUser.id;
      }

      return true;
    },

    // 🔐 JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
      }
      return token;
    },

    // 🔐 SESSION
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;

        // 🔥 include username in session
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });

        if (dbUser) {
          (session.user as any).username = dbUser.username;
        }
      }
      return session;
    },

    // 🔁 REDIRECT
    async redirect({ url, baseUrl }) {
      const target = new URL(url, baseUrl);

      if (
        target.pathname === "/" ||
        target.pathname === "/login" ||
        target.pathname === "/signup"
      ) {
        return `${baseUrl}/`;
      }

      if (target.origin === baseUrl) {
        return target.toString();
      }

      return `${baseUrl}`;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);