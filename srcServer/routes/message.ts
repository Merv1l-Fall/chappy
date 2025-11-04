import express from "express";
import z from "zod";
import type { Router, Request, Response } from "express"
import { verifyToken } from "../data/auth.js";
import { db, tableName } from "../data/dynamoDb.js"
import type { RequestBody, MessageBodyInput, errorResponse, MessageItem } from "../data/types.js";
import { PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getTimeStamp, getUTCTimeStamp } from "../data/getTimeStamp.js";
import { messageItemSchema, messageQuerySchema } from "../data/validation.js";
import { nanoid } from "nanoid";

//local types
type MessageQuery = z.infer<typeof messageQuerySchema>;

const router: Router = express.Router();

router.post("/", verifyToken, async (req: RequestBody<MessageBodyInput>, res: Response<void | errorResponse>) => {
	const senderId = req.user?.userId
	const accessLevel = req.user?.accessLevel
	const { message, channelId, recipientId } = req.body

	if (!senderId || !message || (!channelId && !recipientId)) {
		return res.status(400).send({ error: "Missing required fields" });
	}

	try {
		if (channelId) {
			const getChannelCommand = new GetCommand({
				TableName: tableName,
				Key: {
					pk: `CHANNEL#${channelId}`,
					sk: "METADATA"
				}
			})
			const channel = await db.send(getChannelCommand)
			if (!channel.Item) {
				return res.status(404).send({ error: "Recieving channel not found" })
			}

			const isLocked = channel.Item.isLocked

			//checking if channel is locked. added admin for futureproofing	
			if (isLocked && accessLevel !== "user" && accessLevel !== "admin") {
				return res.status(403).send({ error: "Missing authorization for this channel" })
			}
		}

		const utc = getUTCTimeStamp()
		const local = getTimeStamp()

		const pk = channelId ? `CHANNEL#${channelId}`
			: `DM#${[senderId, recipientId].sort().join("#")}`

		const sk = `MESSAGE#${utc}#${nanoid()}`

		const newMessage = {
			pk,
			sk,
			senderId,
			message,
			timestamp: local,
		};

		const parsed = messageItemSchema.safeParse(newMessage)
		if (!parsed.success) {
			const details = z.flattenError(parsed.error)
			return res.status(400).send({ error: "Error validation message", details: details })
		}

		await db.send(new PutCommand({ TableName: tableName, Item: parsed.data }));

		return res.sendStatus(201)
	} catch (error) {
		console.error("error sending message", error)
		return res.status(500).send({ error: "internal server error" })
	}
});

router.get("/", verifyToken, async (req: Request, res: Response<MessageItem[] | [] | errorResponse>) => {

	//validate queries
	const parsed = messageQuerySchema.safeParse(req.query);
	if (!parsed.success) {
		return res.status(400).send({error: "Invalid queries", details: z.flattenError(parsed.error) });
	}

	const { channelId, recipientId } = parsed.data;
	const senderId = req.user?.userId
	const userAccessLevel = req.user?.accessLevel //might need later

	//validate senderId/JWT
	if (!senderId) {
		return res.status(400).send({ error: "Missing or invalid token" })
	}

	//create pk based on if channelId or recipientId is used
	let pk: string
	if (channelId) {
		pk = `CHANNEL#${channelId.toLowerCase()}`
	} else {
		pk = `DM#${[senderId, recipientId].sort().join("#")}`
	}

	//create query command
	try {
		//if its a channel msg, check if locked
		if(channelId) {
			const getChannelCommand = new GetCommand({
				TableName: tableName,
				Key: {pk: `CHANNEL#${channelId}`, sk: "METADATA"}
			});
			const channel = await db.send(getChannelCommand);
			if(!channel.Item){
				return res.status(404).send({ error: "Channel not found"});
			}
			const { isLocked } = channel.Item;
			if (isLocked && userAccessLevel !== "user" && userAccessLevel !== "admin") {
          return res.status(403).send({ error: "Unauthorized: channel is locked" });
        }
		}

		const queryCommand = new QueryCommand({
			TableName: tableName,
			KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
			ExpressionAttributeValues: {
				":pk": pk,
				":skPrefix": "MESSAGE#",
			},
			ScanIndexForward: false, //sort by descending timestamp
		});

		//execute query and validate results
		const queryResult = await db.send(queryCommand);
		const parsedResult = messageItemSchema.array().safeParse(queryResult.Items);
		if (!parsedResult.success) {
			const details = z.flattenError(parsedResult.error)
			return res.status(500).send({ error: "Error validating messages", details: details })
		}
		const messages = parsedResult.data;
		console.log("Fetched messages:", messages.length);
		return res.status(200).send(messages)

	} catch (error) {
		console.error("Error fetching messages", error)
		res.status(500).send({ error: "Internal server error" })
		return;
	}
});

export default router;