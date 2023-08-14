"use client";

import { NextUIProvider as NextUI } from "@nextui-org/react";
import { ThemeProvider as NextUIThemes } from "next-themes";

export default function NextUIProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<NextUI>
			<NextUIThemes attribute="class" defaultTheme="dark">
				{children}
			</NextUIThemes>
		</NextUI>
	);
}
