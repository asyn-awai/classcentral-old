"use server";

import type { ActionReturn } from "@/types";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

import {
  object,
  string,
  email,
  minLength,
  maxLength,
  safeParse,
} from "valibot";

const credentialsSchema = object({
  email: string([email()]),
  password: string([minLength(1), maxLength(8)]),
});
export async function createUser(formData: FormData) {
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
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user
    .create({
      data: {
        email,
        password: hashedPassword,
      },
    })
    .catch((err) => {
      console.error(err);
      return "Something went wrong!";
    });

  return {
    success: true,
    data: user,
    error: null,
  };
}
