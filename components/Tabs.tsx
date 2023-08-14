"use client";

import type { IconType } from "react-icons/lib";
import { Tabs as NextUITabs, Tab as NextUITab } from "@nextui-org/tabs";

interface Item {
	text: string;
	href: string;
	icon?: React.ReactNode;
}

interface Props {
	items: Item[];
	label: string;
}
export default function Tabs({ items, label }: Props) {
	return (
		<NextUITabs aria-label={label} color="primary" variant="bordered">
			{items.map(({ icon: Icon, ...item }, i) => (
				<NextUITab
					key={`${i}-${item.text}`}
					title={
						<div className="flex items-center space-x-2">
							{Icon}
							<span>{item.text}</span>
						</div>
					}
				/>
			))}
		</NextUITabs>
	);
}
