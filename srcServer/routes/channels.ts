import express, { type Request, type Response } from "express";
import z from "zod";
import { db, tableName } from "../data/dynamoDb.js";
import { getTimeStamp } from "../data/getTimeStamp.js";
import { channelItemSchema, channelInputSchema } from "../data/validation.js";
import type { ChannelItem, ChannelInput, errorResponse, RequestBody, successResponse } from "../data/types.js";
import { ScanCommand, QueryCommand, PutCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { verifyToken } from "../data/auth.js";

const router = express.Router();

//Local types
interface ChannelOutput {
	id: string;
	name: string;
	creatorId: string;
	createdAt?: string;
	isLocked: boolean;
}

//Get all channels
router.get("/", async (req, res: Response<errorResponse | ChannelOutput[]>) => {
	try {
		//create scan command
		const command = new ScanCommand({
			TableName: tableName,
			FilterExpression: "begins_with(pk, :prefix) AND sk = :metadata",
			ExpressionAttributeValues: {
				":prefix": "CHANNEL#",
				":metadata": "METADATA",
			},
		});
		//get channels
		const result = await db.send(command);
		const parsedItems = channelItemSchema.array().safeParse(result.Items);

		//validate output
		if (!parsedItems.success) {
			const errorDetails = z.flattenError(parsedItems.error);
			console.error(errorDetails);
			console.log(result.Items);
			return res.status(400).send({ error: "error validating channel data", details: errorDetails });
		}
		if (parsedItems.data.length === 0) {
			return res.status(400).send({ error: "No channels found" });
		}

		const frontendResponse = parsedItems.data.map(({ pk, name, isLocked, creatorId, createdAt }) => ({
			id: pk.replace("CHANNEL#", ""),
			name,
			isLocked,
			creatorId,
			createdAt,
		}));
		return res.status(200).send(frontendResponse);
	} catch (error) {
		console.error("Error fetching channels", error);
		res.status(500).send({ error: "Internal server error" });
		return;
	}
});

//create a new channel
router.post(
	"/",
	verifyToken,
	async (
		req: RequestBody<ChannelInput>,
		res: Response<{ message: string; channel: ChannelOutput } | errorResponse>
	) => {
		const creatorId = req.user?.userId;
		if (!creatorId) {
			return res.status(401).send({ error: "Invalid or expired token payload" });
		}

		const parsed = channelInputSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).send({ error: "Invalid input", details: z.flattenError(parsed.error) });
		}

		const { name, isLocked } = parsed.data;
		try {
			//Check if channel already exists
			const checkCommand = new QueryCommand({
				TableName: tableName,
				KeyConditionExpression: "pk = :value",
				ExpressionAttributeValues: {
					":value": `CHANNEL#${name.toLowerCase()}`,
				},
			});
			const checkResult = await db.send(checkCommand);
			if (checkResult.Items && checkResult.Items.length > 0) {
				return res.status(401).send({ error: "A channel with that name already exists" });
			}
			//create new channel item
			const newChannel: ChannelItem = {
				pk: `CHANNEL#${name.toLowerCase()}`,
				sk: "METADATA",
				name: name,
				isLocked: isLocked,
				creatorId: creatorId,
				createdAt: getTimeStamp({ dateOnly: true }),
			};

			const putCommand = new PutCommand({
				TableName: tableName,
				Item: newChannel,
			});

			const result = await db.send(putCommand);

			//log new channel
			console.log("New channel created", result);
			const channel = {
				id: newChannel.name.toLowerCase(),
				name: newChannel.name,
				creatorId: newChannel.creatorId,
				createdAt: newChannel.createdAt,
				isLocked: newChannel.isLocked,
			};

			return res.status(201).send({ message: "New channel created!", channel: channel });
		} catch (error) {
			console.error("error creating new channel", error);
			return res.status(500).send({ error: "internal server error" });
		}
	}
);

router.delete("/:id", verifyToken, async (req: Request, res: Response<successResponse | errorResponse>) => {
	const channelId = `CHANNEL#${req.params.id?.toLowerCase()}`;

	const username = req.user?.userId;
	if (!username) {
		return res.status(401).send({ error: "Invalid or expired token payload" });
	}
	try {
		//check if channel exist and creatorId is correct
		const getChannelCommand = new GetCommand({
			TableName: tableName,
			Key: { pk: channelId, sk: "METADATA" },
		});
		const result = await db.send(getChannelCommand);
		if (!result.Item) {
			return res.status(404).send({ error: "Channel not found" });
		}

		const channel = channelItemSchema.parse(result.Item);
		if (channel.creatorId !== username) {
			return res.status(403).send({ error: "You are not the creator of this channel" });
		}
		//delete channel
		const deleteCommand = new DeleteCommand({
			TableName: tableName,
			Key: {
				pk: channel.pk,
				sk: channel.sk,
			},
		});

		await db.send(deleteCommand);
		return res.status(200).send({ success: true, message: "Channel deleted successfully" });
	} catch (error) {
		console.error("Error deleting channel:", error);
		return res.status(500).send({ error: "Internal server error" });
	}
});

export default router;
