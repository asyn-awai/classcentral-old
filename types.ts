import type { ValiError, Issue } from "valibot";

export type Action<T, E = Error | ValiError | string> = (
	formData: FormData
) =>
	| Promise<{
			success: true;
			error: null;
			data: T;
	  }>
	| Promise<{
			success: false;
			error: E;
			data: null;
	  }>
	| never;

export type ActionReturn<T, E = Error | ValiError | string> = ReturnType<Action<T, E>>;

export type ActionErrorState = Record<
	NonNullable<Issue["path"]>[number]["key"],
	string | undefined
>;
