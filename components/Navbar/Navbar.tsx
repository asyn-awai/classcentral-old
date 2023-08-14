import { getCurrentUser } from "@/lib/session";
import SignedOutNavbar from "./SignedOutNavbar";
import SignedInNavbar from "./SignedInNavbar";

export default async function Navbar({}: {}) {
	const user = await getCurrentUser();

	if (!user) {
		return <SignedOutNavbar />;
	} else {
		return <SignedInNavbar />;
	}
}
