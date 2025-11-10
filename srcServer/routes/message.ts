import express from "express";
import z from "zod";
import type { Router, Request, Response } from "express"
import { verifyToken } from "../data/auth.js";
import { db, tableName } from "../data/dynamoDb.js"
import type { RequestBody, MessageBodyInput, errorResponse, MessageItem, RequestQuery } from "../data/types.js";
import { PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getTimeStamp, getUTCTimeStamp } from "../data/getTimeStamp.js";
import { messageItemSchema, messageQuerySchema } from "../data/validation.js";
import { nanoid } from "nanoid";

//local types
type MessageQuery = z.infer<typeof messageQuerySchema>;

type MessageResponse = {
  messageId: string;
  senderId: string;
   message: {
    parts: {
      type: "text" | "image";
      content: string;
      metadata?: Record<string, any> | undefined;
    }[];
  };
  timestamp: string;
};

function formatMessage(item: MessageItem): MessageResponse {
  return {
    messageId: item.sk.split("#").slice(1).join("#"),
    senderId: item.senderId,
    message: item.message,
    timestamp: item.timestamp,
  };
}

const router: Router = express.Router();

router.post("/", verifyToken, async (req: RequestBody<MessageBodyInput>, res: Response<MessageResponse | errorResponse>) => {
	const senderId = req.user?.userId
	const accessLevel = req.user?.accessLevel
	const { message, channelId, recipientId } = req.body

	if (!senderId || !message || (!channelId && !recipientId)) {
		return res.status(400).send({ error: "Missing required fields" });
	}
	if (recipientId && accessLevel === "guest") {
 		return res.status(403).send({ error: "Guests cannot send direct messages" });
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
				return res.status(404).send({ error: "Receiving channel not found" })
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
			: `DM#${[senderId, recipientId].sort().join("#").toLowerCase()}`//dubbelkolla så det fungerar som tänkt, vem som skickar och tar emot

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

		const { senderId: sender, message: msg, timestamp } = parsed.data;
		const messageId = parsed.data.sk.split("#").slice(1).join("#");

		return res.status(201).send(formatMessage(parsed.data))
	} catch (error) {
		console.error("error sending message", error)
		return res.status(500).send({ error: "internal server error" })
	}
});

router.get("/", verifyToken, async ( req: RequestQuery<MessageQuery>, res: Response<MessageResponse[] | errorResponse | "No messages found"> ) => {
    const senderId = req.user?.userId;
    const accessLevel = req.user?.accessLevel;

    // Validate JWT / sender
    if (!senderId) {
      return res.status(400).send({ error: "Missing or invalid token" });
    }

    // Validate queries
    const parsedQuery = messageQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      return res
        .status(400)
        .send({ error: "Invalid queries", details: z.flattenError(parsedQuery.error) });
    }

    const { channelId, recipientId } = parsedQuery.data;

    // Require at least one identifier
    if (!channelId && !recipientId) {
      return res.status(400).send({ error: "Missing channelId or recipientId" });
    }

    try {
      // Build PK

      const pk = channelId
        ? `CHANNEL#${channelId.toLowerCase()}`
        : `DM#${[senderId, recipientId].sort().join("#").toLowerCase()}`;

      // If channel, check if locked
      if (channelId) {
        const getChannelCommand = new GetCommand({
          TableName: tableName,
          Key: { pk: `CHANNEL#${channelId}`, sk: "METADATA" },
        });

        const channel = await db.send(getChannelCommand);
        if (!channel.Item) {
          return res.status(404).send({ error: "Channel not found" });
        }

        const { isLocked } = channel.Item;
        if (isLocked && accessLevel !== "user" && accessLevel !== "admin") {
          return res.status(403).send({ error: "Missing authorization for this channel" });
        }
      }

      // Query messages
      const queryCommand = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
        ExpressionAttributeValues: {
          ":pk": pk,
          ":skPrefix": "MESSAGE#",
        },
        ScanIndexForward: false, // newest first
      });

      const queryResult = await db.send(queryCommand);
	  if (!queryResult.Items) {
		res.status(204).send("No messages found")
	  }

      // Validate items
      const parsedMessages = messageItemSchema.array().safeParse(queryResult.Items);
      if (!parsedMessages.success) {
        const details = z.flattenError(parsedMessages.error);
        return res.status(500).send({ error: "Error validating messages", details });
      }

      // Format for response (hide pk/sk)
      const messages = parsedMessages.data.map(formatMessage)

      return res.status(200).send(messages);
    } catch (error) {
      console.error("Error fetching messages", error);
      return res.status(500).send({ error: "Internal server error" });
    }
  }
);


export default router;