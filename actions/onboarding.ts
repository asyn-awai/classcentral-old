"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { object, string, safeParse, regex } from "valibot";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";

// const onboardingSchema = object({
// 	name: string(),
// 	"profile-type": string([regex(/^[0-9]+$/)]),
// 	"class-code": string([regex(/^[a-zA-Z0-9]{6}$|^$/)]),
// });
// export async function onboardingSetup(formData: FormData) {
// 	const parse = safeParse(
// 		onboardingSchema,
// 		Object.fromEntries(formData.entries())
// 	);

// 	if (!parse.success) {
// 		return {
// 			success: false,
// 			error: parse.error.issues,
// 		};
// 	}

// 	const {
// 		name,
// 		"profile-type": profileType,
// 		"class-code": classCode,
// 	} = parse.data;

// 	const supabase = createServerActionClient<Database>({ cookies });

// 	const {
// 		data: { user },
// 	} = await supabase.auth.getUser();

// 	if (classCode === "") {
// 		await createProfile(supabase, user, name, profileType);
// 		return redirect("/dashboard");
// 	} else if (classCode !== "") {
// 		if (user === null) {
// 			return redirect("/sign-up");
// 		}
// 		const [profile, classroom] = await Promise.all([
// 			createProfile(supabase, user, name, profileType),
// 			joinClassroom(supabase, user, classCode),
// 		]);
// 		if (!profile.success || !classroom.success) {
// 			return {
// 				success: false,
// 				error: profile.error ?? classroom.error,
// 			};
// 		}
// 		return redirect(`/classrooms/${classroom.data!.id}`);
// 	}
// 	return redirect("/");
// }

// // helpers

// async function createProfile(
// 	supabase: ReturnType<typeof createServerActionClient<Database>>,
// 	user: Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"],
// 	name: string,
// 	profileType: string
// ) {
// 	const { data: profile, error } = await supabase
// 		.from("profiles")
// 		.select("*")
// 		.eq("id", user?.id)
// 		.single();

// 	if (error || !user) {
// 		return {
// 			success: false,
// 			error: error ? error.message : "User not found",
// 		};
// 	}

// 	if (!profile) {
// 		return redirect("/sign-up");
// 	}

// 	if (profile.profile_type !== -1) {
// 		return redirect("/dashboard");
// 	}

// 	const { error: updateError } = await supabase
// 		.from("profiles")
// 		.update({
// 			name,
// 			profile_type: +profileType,
// 		})
// 		.eq("id", user?.id);

// 	if (updateError) {
// 		console.error(updateError);
// 		return {
// 			success: false,
// 			error: updateError.message,
// 		};
// 	}

// 	return {
// 		success: true,
// 		error: null,
// 		data: profile,
// 	};
// }

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
