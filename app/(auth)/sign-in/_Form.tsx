"use client";

import type { ActionReturn, ActionErrorState } from "@/types/types";
import { useEffect, useState } from "react";
import { HiLockClosed, HiMail } from "react-icons/hi";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { FaGoogle } from "react-icons/fa";
import FormInput from "@/components/FormInput";
// import { signInWithCredentials } from "@/actions/auth";
import { transformError } from "@/lib/errors";
import { toastError } from "@/lib/utils";

export default function SignInForm() {
	const [formLoading, setFormLoading] = useState(false);
	const [errors, setErrors] = useState<ActionErrorState>({});

	const handleSignInWithProvider = async (
		provider: Parameters<typeof signIn>[0]
	) => {
		await signIn(provider, {
			callbackUrl: "/onboarding",
		});
	};

	return (
		<form
			className="grid w-full grid-cols-1 gap-4"
			noValidate
			// action={async formData => {
			// 	if (formLoading) return;
			// 	setFormLoading(() => true);
			// 	try {
			// 		const res = await signInWithCredentials(formData);
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
					Sign in with Google
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
				required={false}
			/>
			<FormInput
				name="password"
				type="password"
				label="Password"
				icon={HiLockClosed}
				validationState={errors.password ? "invalid" : "valid"}
				errorMessage={errors.password}
				setErrors={setErrors}
				required={false}
			/>
            // TODO: Add forgot password
			<p className="cursor-pointer max-w-fit select-none relative inline-flex items-center tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium text-primary no-underline hover:opacity-80 active:opacity-disabled transition-opacity font-semibold">
				Forgot password?
			</p>
			<div className="flex justify-center">
				<Button
					isDisabled={formLoading}
					size="lg"
					color="primary"
					className="w-full"
					type="submit"
				>
					Sign in
				</Button>
			</div> */}
		</form>
	);
}
