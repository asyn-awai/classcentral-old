import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import toast, { type ToastOptions } from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function toastSuccess(message: string, options: ToastOptions = {}) {
	if (typeof toast.success !== "function") return;
	return toast.success(message, {
		duration: 4000,
		position: "bottom-right",
		style: {
			background: "#18c964",
			color: "white",
		},
		...options,
	});
}

export function toastError(message: string, options: ToastOptions = {}) {
	console.error(message);
	if (typeof toast.error !== "function") return;
	return toast.error(message, {
		duration: 4000,
		position: "bottom-right",
		style: {
			background: "#f31260",
			color: "white",
		},
		...options,
	});
}
