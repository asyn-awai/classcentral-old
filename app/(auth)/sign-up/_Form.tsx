"use client";

import type { Issue } from "valibot";
import { useEffect, useState } from "react";
import { HiLockClosed, HiMail } from "react-icons/hi";
import { signIn } from "next-auth/react";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { FaGoogle } from "react-icons/fa";
import FormInput from "@/components/FormInput";
import { createUser } from "@/actions/auth";
import { transformError } from "@/lib/errors";
import { toastError, toastSuccess } from "@/lib/utils";

export default function SignInForm({
	as,
}: {
	as: "student" | "teacher" | "parent" | undefined;
}) {
	const [formLoading, setFormLoading] = useState(false);
	const [errors, setErrors] = useState<
		Record<NonNullable<Issue["path"]>[number]["key"], string | undefined>
	>({});

	const handleSignInWithProvider = async (
		provider: Parameters<typeof signIn>[0]
	) => {
		await signIn(provider, {
			callbackUrl: "/onboarding",
		});
	};

	const createCredentialsUser = async (formData: FormData) => {
        // if (!formLoading) return;
		// setFormLoading(() => true);
		const res = await createUser(formData);
        console.log(res)
		if (!res.success) {
			if (typeof res.error === "string") {
				toastError(res.error);
				return;
			}
			const errors = transformError(res.error);
			setErrors(() => errors);
		} else {
			await signIn("credentials", {
				email: res.data.email,
				password: res.data.password,
				// callbackUrl: "/onboarding",
			})
				.then(() => toastSuccess("Account Created"))
				.catch(error => {
					toastError(error.message);
				});
		}
		// setFormLoading(() => false);
	};

	return (
		<form
			className="grid w-full grid-cols-1 gap-4"
			noValidate
			action={createCredentialsUser}
		>
			<div className="flex items-center justify-center gap-4">
				<Button
					size="lg"
					color="primary"
					onPress={async () => {
						setFormLoading(() => true);
						try {
							await handleSignInWithProvider("google");
						} catch (error) {
							console.error(error);
						} finally {
							setFormLoading(() => false);
						}
					}}
					endContent={<FaGoogle />}
					className="w-full"
					isLoading={formLoading}
					disabled={formLoading}
				>
					Sign up with Google
				</Button>
			</div>
			<Divider />
			<FormInput
				name="email"
				type="email"
				label="Email"
				icon={HiMail}
				validationState={errors.email ? "invalid" : "valid"}
				errorMessage={errors.email}
				setErrors={setErrors}
			/>
			<FormInput
				name="password"
				type="password"
				label="Password"
				icon={HiLockClosed}
				validationState={errors.password ? "invalid" : "valid"}
				errorMessage={errors.password}
				description="At least 6 characters long"
				setErrors={setErrors}
			/>
			<div className="flex justify-center">
				<Button
					size="lg"
					color="primary"
					className="w-full"
					type="submit"
					isDisabled={formLoading}
					isLoading={formLoading}
				>
					Sign Up
				</Button>
			</div>
		</form>
	);
}
