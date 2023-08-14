import SignUpForm from "./_Form";
import Link from "@/components/Link";
import { redirect } from "next/navigation";

interface Props {
	searchParams: {
		as?: "student" | "teacher" | "parent";
	};
}

export default async function SignUp({ searchParams: { as } }: Props) {
	if (
		typeof as === "string" &&
		!["student", "teacher", "parent"].includes(as)
	) {
		redirect("/sign-up");
	}

	return (
		<div className="flex flex-col items-center justify-center w-full max-w-md gap-y-8">
			<h1 className="text-3xl font-bold">Sign Up</h1>
			<SignUpForm as={as} />
			<p className="text-foreground-500">
				Already have an account?{" "}
				<Link className="font-semibold" href="/sign-in">
					Sign In
				</Link>
			</p>
		</div>
	);
}
