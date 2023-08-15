import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
<<<<<<< HEAD
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import {
  object,
  string,
  regex,
  minLength,
  maxLength,
  safeParse,
  email,
} from "valibot";

const credentialsSchema = object({
  email: string([email("Email must be a valid email")]),
  password: string([
    minLength(8, "Password must have at least 8 characters"),
    maxLength(64, "Password must have at most 64 characters"),
  ]),
});

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials) return null;
        const parse = safeParse(credentialsSchema, credentials);
        if (!parse.success) {
          return null;
        }
        const { email, password } = parse.data;
        const user = await prisma.user.findFirst({
          where: {
            email,
            password,
          },
        });
        if (!user) return null;
        const isPasswordValid = await bcrypt.compare(user.password, password)
        return isPasswordValid ? user : null;
      },
    }),
  ],
  // callbacks: {
  //   async session({ session, token }) {
  //     session.user!.email = token.email
  //   },
  //   async signIn({ credentials }) {

  //   },
  // },
=======
import prisma from "@/lib/prisma";
import { object, string, email, minLength, maxLength, parse } from "valibot";
import bcrypt from "bcrypt";

const credentialsSchema = object({
	email: string([email(), minLength(3), maxLength(64)]),
	password: string([minLength(6), maxLength(64)]),
});

const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
		maxAge: 60 * 60 * 24 * 30, // 30 days
	},
	pages: {
		signIn: "/sign-in",
		newUser: "/sign-up",
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "text",
					placeholder: "jsmith@email.com",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials) return null;
				const { email, password } = parse(
					credentialsSchema,
					credentials
				);
				console.log(email, password);
				const user = await prisma.user.findUnique({
					where: { email },
				});
				console.log(1);
				if (!user || !user.password) return null;
				console.log(2);
				const passwordMatch = await bcrypt.compare(
					password,
					user.password
				);
				console.log(password, user.password);
				console.log(3);
				if (!passwordMatch) return null;
				console.log(4);
				return user;
			},
		}),
	],
	callbacks: {
		async session({ session, user }) {
			return {
				...session,
				user: {
					...session.user,
					id: user.id,
				},
			};
		},
		// async jwt({ token, user }) {
		// 	if (user) {
		// 		token.id = user.id;
		// 	}
		// 	return token;
		// },
	},
>>>>>>> 998aa11d9598da75ccbd95dc22bc6c40c12b06d5
};

export default authOptions;
