"use client";

import { useState } from "react";
import { Button } from "@nextui-org/button";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from "@nextui-org/dropdown";
import Link from "next/link";

interface Props {
	classroomId: string;
	name: string;
	label?: string;
	defaultValue?: Props["options"][number];
	options: {
		text: string;
		value: string | null;
	}[];
}

export default function SelectMenu({
	classroomId,
	name,
	label,
	defaultValue = {
		text: "Select...",
		value: null,
	},
	options,
}: Props) {
	const [selected, setSelected] = useState<Props["options"][number]>({
		text: defaultValue.text,
		value: defaultValue.value,
	});

	return (
		<div className="max-w-fit">
			{/* <input
				name={name}
				className="hidden"
				readOnly
				value={selected.value ?? "null"}
			/> */}
			<Dropdown
				id={`${name}-dropdown`}
				classNames={{
					trigger: "h-14",
				}}
				className="block w-full"
			>
				<DropdownTrigger className="w-full">
					<Button type="button" variant="bordered">
						<label className="font-bold cursor-pointer">
							{label}:
						</label>
						<span className="ml-2">{selected.text}</span>
					</Button>
				</DropdownTrigger>
				<DropdownMenu items={options} className="w-full">
					{(option: any) => (
						<DropdownItem
							color={
								option.value === selected.value
									? "primary"
									: "default"
							}
							className={`${
								option.value === selected.value
									? "bg-blue-500"
									: ""
							}`}
							key={option.value}
							onPress={() =>
								setSelected({
									text: option.text,
									value: option.value,
								})
							}
						>
							<Link
								className="flex w-full h-full"
								href={`/classrooms/${classroomId}/leaderboard?activity=${option.value}`}
							>
								{option.text}
							</Link>
						</DropdownItem>
					)}
				</DropdownMenu>
			</Dropdown>
		</div>
	);
}