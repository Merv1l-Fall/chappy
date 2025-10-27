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


const channelItemSchema = z.object({
	pk: z.string(),
	sk: z.literal("METADATA"),
	name: z.string().min(4),
	isLocked: z.boolean(),
	creatorId: z.string(),
	createdAt: z.string(),
})

const channelInputSchema = z.object({
  name: z.string().min(1, "Channel name is required"),
  isLocked: z.boolean(),
});

export { userInputSchema, userItemSchema, channelItemSchema, channelInputSchema };