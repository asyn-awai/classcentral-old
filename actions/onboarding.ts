"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { object, string, safeParse, regex } from "valibot";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { elseThrow } from "@/lib/errors";

type Role = "STUDENT" | "TEACHER" | "PARENT";

const onboardingSchema = object({
  name: string(),
  "profile-type": string([regex(/^(STUDENT|TEACHER|PARENT)$/)]),
  "class-code": string([regex(/^[a-zA-Z0-9]{6}$|^$/)]),
});
export async function onboardingSetup(formData: FormData) {
  const parse = safeParse(
    onboardingSchema,
    Object.fromEntries(formData.entries())
  );

  if (!parse.success) {
    return {
      success: false,
      error: parse.error.issues,
    };
  }

  const {
    name,
    "profile-type": profileType,
    "class-code": classCode,
  } = parse.data;

  const user = await getCurrentUser();
  if (!user) return redirect("/sign-in");

  if (classCode === "") {
    await createProfile(user, name, profileType as Role);
    return redirect("/dashboard");
  } else if (classCode !== "") {
    if (user === null) {
      return redirect("/sign-up");
    }
    const [profile, classroom] = await Promise.all([
      createProfile(user, name, profileType as Role),
      joinClassroom(supabase, user, classCode),
    ]);
    if (!profile.success || !classroom.success) {
      return {
        success: false,
        error: profile.error ?? classroom.error,
      };
    }
    return redirect(`/classrooms/${classroom.data!.id}`);
  }
  return redirect("/");
}

// // helpers

async function createProfile(
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>,
  name: string,
  profileType: Role
) {
  await prisma.profile.create({
    data: {
      userId: (
        (await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        })) ?? elseThrow("User not found")
      ).id,
      name,
      role: profileType,
    },
  });
}

// async function joinClassroom(
// 	supabase: ReturnType<typeof createServerActionClient<Database>>,
// 	user: NonNullable<
// 		Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"]
// 	>,
// 	classCode: string
// ) {
// 	const { data: classroom, error } = await admin
// 		.from("classrooms")
// 		.select("*")
// 		.eq("join_code", classCode.toUpperCase())
// 		.single();

// 	if (error || !classroom) {
// 		return {
// 			success: false,
// 			error: error ? error.message : "Classroom not found",
// 		};
// 	}

// 	const { error: insertError } = await supabase.from("members").insert({
// 		classroom_id: classroom.id,
// 		member_id: user.id,
// 	});

// 	if (insertError) {
// 		return {
// 			success: false,
// 			error: insertError.message,
// 		};
// 	}

// 	return {
// 		success: true,
// 		error: null,
// 		data: classroom,
// 	};
// }
