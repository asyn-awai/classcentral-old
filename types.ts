import type { ValiError, Issue } from "valibot";

export type Action = <T, E = Error | ValiError | string>(
	formData: FormData
) =>
	| {
			success: true;
			error: null;
			data: T;
	  }
	| {
			success: false;
			error: E;
			data: null;
	  }
	| never;

export type ActionReturn = ReturnType<Action>;

export type ActionErrorState = Record<
	NonNullable<Issue["path"]>[number]["key"],
	string | undefined
>;
