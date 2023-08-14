import type { Issue } from "valibot";
import type { IconType } from "react-icons/lib";
import { Input } from "@nextui-org/input";

export default function FormInput({
	name,
	type,
	label,
	icon: Icon,
	description,
	defaultValue,
	validationState,
	errorMessage,
	setErrors = () => {},
	required = true,
	theme = "dark",
}: {
	name: string;
	type: string;
	label: string;
	icon?: IconType;
	defaultValue?: string;
	validationState?: "valid" | "invalid";
	errorMessage?: string;
	setErrors?: React.Dispatch<
		React.SetStateAction<
			Record<
				NonNullable<Issue["path"]>[number]["key"],
				string | undefined
			>
		>
	>;
	description?: string;
	required?: boolean;
	theme?: string;
}) {
	return (
		<Input
			isRequired={required}
			onInput={() => setErrors(prev => ({ ...prev, [name]: undefined }))}
			name={name}
			type={type}
			label={label}
			defaultValue={defaultValue}
			labelPlacement="inside"
			size="md"
			description={description}
			// validationState={
			// 	validationState ?? errorMessage ? "invalid" : "valid"
			// }
			validationState={validationState}
			errorMessage={errorMessage}
			endContent={
				Icon ? (
					<Icon
						size={25}
						className={`transition-colors ${
							theme === "dark" ? "text-white" : "text-gray-700"
						}`}
					/>
				) : undefined
			}
		/>
	);
}
