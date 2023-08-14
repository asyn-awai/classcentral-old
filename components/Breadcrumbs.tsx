import type { IconType } from "react-icons/lib";
import { FaAngleRight } from "react-icons/fa";
import { HiAnnotation, HiChevronRight } from "react-icons/hi";
import Link from "@/components/Link";

interface Item {
	text: string;
	href?: string;
	icon?: IconType;
}

export default function Breadcrumbs({ items }: { items: Item[] }) {
	return (
		<div className="flex items-center gap-1">
			{items.map(({ icon: Icon, ...item }, i) => (
				<div
					key={i}
					className={`flex items-center gap-1 ${
						i === items.length - 1 ? "text-foreground-500" : ""
					}`}
				>
					{Icon && <Icon size={20} />}
					{item.href ? (
						<Link
							size="lg"
							href={item.href}
							color={
								i === items.length - 1
									? "primary"
									: "foreground"
							}
						>
							{item.text}
						</Link>
					) : (
						<span className="text-lg">{item.text}</span>
					)}

					{i !== items.length - 1 && <HiChevronRight size={20} />}
				</div>
			))}
		</div>
	);
}