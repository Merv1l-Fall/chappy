import z from 'zod';

//user
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

//channels
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

//messages
export const messageItemSchema = z.object({
  pk: z.string(),
  sk: z.string(),
  senderId: z.string(),
  message: z.object({
    parts: z.array(
      z.object({
        type: z.enum(["text", "image"]),
        content: z.string().min(1, "Content cannot be empty"),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    ).min(1, "Message must have at least one part"),
  }),
  timestamp: z.string(),
});

const messageQuerySchema = z.object({
  channelId: z.string().optional(),
  recipientId: z.string().optional(),
}).refine(
  (data) => data.channelId || data.recipientId,
  "Must include either channelId or recipientId"
);

export { userInputSchema, userItemSchema, channelItemSchema, channelInputSchema, messageQuerySchema };