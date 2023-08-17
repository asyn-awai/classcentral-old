import { object, string, email, minLength, maxLength } from "valibot";

export const credentialsSchema = object({
    email: string([email("Invalid Email")]),
    password: string([
        minLength(6, "Password must be at least 6 characters"),
        maxLength(64, "Password must be at most 64 characters"),
    ]),
});
