import express from "express";
import z from "zod";
import type { Router, Request, Response } from "express"
import { verifyToken } from "../data/auth.js";
import { db, tableName } from "../data/dynamoDb.js"
import type { RequestBody, MessageBodyInput, errorResponse } from "../data/types.js";
import { PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getTimeStamp, getUTCTimeStamp } from "../data/getTimeStamp.js";
import { messageItemSchema } from "../data/validation.js";

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

		const sk = `MESSAGE#${utc}#${crypto.randomUUID()}`

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
			return res.status(400).send({error: "Error validation message", details: details})
		}

		 await db.send(new PutCommand({ TableName: tableName, Item: parsed.data }));

		 return res.sendStatus(201)
	} catch (error) {
			console.error("error sending message", error)
			return res.status(500).send({error: "internal server error"})
	}
})