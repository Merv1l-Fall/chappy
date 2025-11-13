import z from "zod";

export const CreateAccountSchema = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters long")
		.max(20, "Username can not be longer than 20 characters")
		.regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long")
		.max(30, "Password can not be longer than 30 characters")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),
});

export const LoginSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password is required"),
});

export const createChannelSchema = z.object({
	name: z
		.string()
		.min(3, "Channelname cant be shorter than 3 characters")
		.max(15, "Channelname cant be longer than 15 characters")
		.regex(/^[a-z0-9_]+$/, "Channelname can only contain lowercase letters, numbers, and underscores"),

	isLocked: z.boolean(),
});
