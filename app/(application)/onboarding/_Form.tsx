"use client";

import type { Issue } from "valibot";
import { useState, useEffect } from "react";
import FormInput from "@/components/FormInput";
import { Button } from "@nextui-org/button";
import { HiAtSymbol, HiHashtag } from "react-icons/hi";
import { toastError, toastSuccess } from "@/lib/utils";
import { onboardingSetup } from "@/actions/onboarding";
import { transformError } from "@/lib/errors";

const profileTypes = ["student", "teacher"] as const;

export default function OnboardingForm({
	as,
	initialName = "",
}: {
	as?: (typeof profileTypes)[number];
	initialName?: string;
}) {
	const [errors, setErrors] = useState<
		Record<NonNullable<Issue["path"]>[number]["key"], string | undefined>
	>({});
	const [selectedRole, setSelectedRole] = useState<
		(typeof profileTypes)[number]
	>(as ?? "student");

	useEffect(() => {
		if (errors["profile-type"]) {
			console.log(errors["profile-type"]);
		}
	}, [errors]);

	return (
		<form
			className="grid w-full grid-cols-1 gap-8 mt-8"
			noValidate
			action={async formData => {
				try {
					const res = await onboardingSetup(formData);
					if (!res.success) {
						if (typeof res.error === "string") {
							throw new Error(res.error);
						}
						setErrors(transformError(res.error));
					}
				} catch (error) {
					if (error instanceof Error) {
						if (error.message === "NEXT_REDIRECT") {
							toastSuccess("Your account has been created!");
							throw error;
						}
						toastError(error.message);
					} else {
						toastError("An unknown error occurred");
					}
				}
			}}
		>
			<FormInput
				name="name"
				label="Name"
				type="text"
				icon={HiAtSymbol}
				defaultValue={initialName}
				validationState={errors.name ? "invalid" : "valid"}
				errorMessage={errors.name}
				setErrors={setErrors}
			/>
			<FormInput
				name="class-code"
				label="Class Code"
				type="text"
				icon={HiHashtag}
				description="Ask your teacher for the class code"
				validationState={errors["class-code"] ? "invalid" : "valid"}
				errorMessage={errors["class-code"]}
				setErrors={setErrors}
				required={false}
			/>
			<div className="flex flex-col items-center justify-center gap-4">
				<label
					htmlFor="type-select"
					className="text-center text-foreground-500"
				>
					Which role best describes you?
				</label>
				<div
					id="type-select"
					className="flex flex-wrap justify-center gap-4"
				>
					<input
						name="profile-type"
						className="hidden"
						value={profileTypes.indexOf(selectedRole)}
						readOnly
					/>
					{profileTypes.map(role => (
						<RoleButton
							key={role}
							role={role}
							selectedRole={selectedRole}
							setSelectedRole={setSelectedRole}
						/>
					))}
				</div>
			</div>
			<Button type="submit" size="lg" className="" color="primary">
				Sign Up
			</Button>
		</form>
	);
}

function RoleButton({
	role,
	selectedRole,
	setSelectedRole,
}: {
	role: "student" | "teacher";
	selectedRole: "student" | "teacher";
	setSelectedRole: React.Dispatch<
		React.SetStateAction<"student" | "teacher">
	>;
}) {
	return (
		<Button
			onPress={() => setSelectedRole(role)}
			size="lg"
			className=""
			variant={selectedRole === role ? "solid" : "bordered"}
			color={selectedRole === role ? "secondary" : "default"}
		>
			<p className="first-letter:capitalize">{role}</p>
		</Button>
	);
}
