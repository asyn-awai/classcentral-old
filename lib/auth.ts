import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
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
	// pages: {
	// 	signIn: "/sign-in",
	// 	newUser: "/sign-up",
	// },
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
				if (!credentials) return null;
				const { email, password } = parse(
					credentialsSchema,
					credentials
				);
				const user = await prisma.user.findUnique({
					where: {
						email,
					},
				});
				if (!user || !user.password) return null;
				const isPasswordValid = await bcrypt.compare(
					password,
					user.password
				);
				return isPasswordValid ? user : null;
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
			}
			return session;
		},
		async jwt({ token, user }) {
			const existingUser = await prisma.user.findUnique({
				where: { email: token.email ?? undefined },
			});
			if (!existingUser) {
				if (user) {
					token.id = user.id;
				}
				return token;
			}

			return {
				id: existingUser.id,
				name: existingUser.name,
				email: existingUser.email,
				image: existingUser.image,
			};
		},
	},
};

export default authOptions;
