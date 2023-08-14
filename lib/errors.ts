import type { Issue, Issues } from "valibot";

export function transformError(error: Issues | null) {
	if (!error) return {};
	return error.reduce((res, { message, path }) => {
		res[path?.[0].key] = message;
		return res;
	}, {} as Record<NonNullable<Issue["path"]>[number]["key"], string | undefined>);
}
