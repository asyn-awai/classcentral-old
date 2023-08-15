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
};

export default authOptions;
