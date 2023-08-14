"use client";

import type { Issue } from "valibot";
import { useEffect, useState } from "react";
import { HiLockClosed, HiMail } from "react-icons/hi";
import { signIn } from "next-auth/react";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { FaGoogle } from "react-icons/fa";
import FormInput from "@/components/FormInput";
// import { signUpWithCredentials } from "@/actions/auth";
import { transformError } from "@/lib/errors";
import { toastError } from "@/lib/utils";

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

	useEffect(() => console.log(formLoading), [formLoading]);

	return (
		<form
			className="grid w-full grid-cols-1 gap-4"
			noValidate
			// action={async formData => {
			// 	if (formLoading) return;
			// 	setFormLoading(() => true);
			// 	try {
			// 		const res = await signUpWithCredentials(formData);
			// 		if (!res.success) {
			// 			if (typeof res.error === "string")
			// 				toastError(res.error);
			// 			else setErrors(transformError(res.error));
			// 		}
			// 	} catch (error) {
			// 		if (error instanceof Error) {
			// 			if (error.message === "NEXT_REDIRECT") {
			// 				throw error;
			// 			}
			// 		}
			// 	} finally {
			// 		setFormLoading(() => false);
			// 	}
			// }}
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
			{/* <Divider />
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
					// onTouchStart={() => handleProvider("google")}
					className="w-full"
					type="submit"
					isDisabled={formLoading}
					isLoading={formLoading}
				>
					Sign Up
				</Button>
			</div> */}
		</form>
	);
}
