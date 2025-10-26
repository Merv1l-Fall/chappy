import { access } from 'fs';
import z from 'zod';

const userInputSchema = z.object({
	username: z.string().min(3, 'Username must be at least 3 characters long'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const userItemSchema = z.object({
	pk: z.string(),
	sk: z.string(),
	username: z.string(),
	passwordHash: z.string(),
	accessLevel: z.string(),
});

export { userInputSchema, userItemSchema };