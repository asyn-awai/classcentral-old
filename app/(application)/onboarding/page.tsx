import OnboardingForm from "./_Form";
import { getCurrentUser } from "@/lib/session";

interface Props {
	searchParams: {
		as?: "student" | "teacher" | undefined;
	};
}

export default async function Onboarding({ searchParams: { as } }: Props) {
	const user = await getCurrentUser();

	return (
		<main className="flex flex-col items-center w-5/6 p-8 gap-y-4">
			<h1 className="mt-8 text-5xl font-bold">
				Welcome to ClassCentral!
			</h1>
			<h2 className="text-2xl text-foreground-500">
				Let&apos;s get you set up.
			</h2>
			<div className="w-full max-w-md">
				<OnboardingForm as={as} initialName={user?.name ?? ""} />
			</div>
		</main>
	);
}
