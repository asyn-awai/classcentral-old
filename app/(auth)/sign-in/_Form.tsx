"use client";

import type { ActionReturn, ActionErrorState } from "@/types/types";
import { useEffect, useState, useTransition } from "react";
import { redirect } from "next/navigation";
import { HiLockClosed, HiMail } from "react-icons/hi";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { FaGoogle } from "react-icons/fa";
import FormInput from "@/components/FormInput";
import { toastSuccess, toastError } from "@/lib/utils";
import { safeParse } from "valibot";
import { credentialsSchema } from "@/lib/validation/credentials";
import { transformError } from "@/lib/errors";
import {debug} from '@/actions/auth'

export default function SignInForm() {
    const [formLoading, setFormLoading] = useState(false);
    const [errors, setErrors] = useState<ActionErrorState>({});
const [, startTransition] = useTransition();
    const handleSignInWithProvider = async (
        provider: Parameters<typeof signIn>[0]
    ) => {
        await signIn(provider, {
            callbackUrl: "/onboarding",
        });
    };

    const userSignIn = async (formData: FormData) => {
        if (formLoading) return;
        setFormLoading(() => true);
        try {
            const parse = safeParse(
                credentialsSchema,
                Object.fromEntries(formData.entries())
            );
            if (!parse.success) {
                throw new Error(JSON.stringify(parse.error.issues, null, 2));
            }
            const s = await signIn("credentials", {
                email: parse.data.email,
                password: parse.data.password,
                callbackUrl: "/onboarding",
                redirect: false,
            });
			startTransition(async () => await debug(s))
            if (s?.error) {
				alert(JSON.stringify(s))
				throw new Error(s.error)
			};
            if (!s?.ok) {
				alert('2 ' + JSON.stringify(s))
                console.log(s);
                throw JSON.stringify(s, null, 2);
                // throw new Error("Something went wrong");
            }
            toastSuccess("Successfully logged in!");
            redirect("/onboarding");
        } catch (error) {
			if (typeof error === "string") {
				toastError(error);
			} else if (error instanceof Error) {
                if (error.message === "NEXT_REDIRECT") {
                    throw error;
                }
                toastError(error.message);
            } else console.error(error);
        } finally {
            setFormLoading(() => false);
        }
    };

    return (
        <form
            className="grid w-full grid-cols-1 gap-4"
            noValidate
            action={userSignIn}
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
            {/* <Divider /> */}
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
            {/* <p className="cursor-pointer max-w-fit select-none relative inline-flex items-center tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium text-primary no-underline hover:opacity-80 active:opacity-disabled transition-opacity font-semibold">
				Forgot password?
			</p> */}
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
            </div>
        </form>
    );
}
