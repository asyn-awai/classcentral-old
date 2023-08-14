import SignInForm from "./_Form";
import Link from "@/components/Link";

export default async function SignIn() {
	return (
		<div className="flex flex-col items-center justify-center w-full max-w-md gap-y-8">
			<h1 className="text-3xl font-bold">Sign In</h1>
			<SignInForm />
			<p className="text-foreground-500">
				Need an account?{" "}
				<Link className="font-semibold" href="/sign-up">
					Sign Up
				</Link>
			</p>
		</div>
	);
}