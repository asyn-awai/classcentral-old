import {
	type LinkProps as NextLinkProps,
	default as NextLink,
} from "next/link";
import {
	type LinkProps as NextUILinkProps,
	Link as NextUILink,
} from "@nextui-org/link";

export default function Link({
	children,
	...linkProps
}: {
	children: React.ReactNode;
} & NextLinkProps &
	NextUILinkProps) {
	const omit = (obj: Record<string, any>, keys: string[]) =>
		Object.fromEntries(
			Object.entries(obj).filter(([key]) => !keys.includes(key))
		);

	return (
		<NextUILink {...omit(linkProps, ["ref"])} ref={undefined} as={NextLink}>
			{children}
		</NextUILink>
	);
}