import z from "zod"

export const CreateAccountSchema = z.object({
	username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username can not be longer than 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
	password: z.string().min(6, "Password must be at least 6 characters long").max(30, "Password can not be longer than 30 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
})

export const LoginSchema = z.object({
	username: z.string().length(1, "Username is required"),
	password: z.string().length(1, "Password is required"),
})