"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

import {
	type Issues,
	object,
	string,
	email,
	minLength,
	maxLength,
	safeParse,
} from "valibot";

const credentialsSchema = object({
	email: string([email("Invalid Email")]),
	password: string([
		minLength(6, "Password must be at least 6 characters"),
		maxLength(64, "Password must be at most 64 characters"),
	]),
});

export async function createUser(formData: FormData): Promise<
	| {
			success: false;
			error: Issues | string;
	  }
	| {
			success: true;
			data: Awaited<ReturnType<typeof prisma.user.create>>;
			error: null;
	  }
> {
	const data = Object.fromEntries(formData.entries());
	const parse = safeParse(credentialsSchema, data);
	if (!parse.success) {
		return {
			success: false,
			error: parse.error.issues,
		};
	}
	const { email, password } = parse.data;

	const existingUser = await prisma.user.findUnique({
		where: { email },
	});
	if (existingUser) {
		return {
			success: false,
			error: "User already exists",
		};
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	let user = {} as Awaited<ReturnType<typeof prisma.user.create>>;

	try {
		user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});
	} catch (err) {
		return {
			success: false,
			error: "Something went wrong while creating your account",
		};
	}

	return {
		success: true,
		data: user,
		error: null,
	};
}

export async function debug(error: any) {
	console.log(error);
}
