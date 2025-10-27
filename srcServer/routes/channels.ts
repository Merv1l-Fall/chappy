import express, { type Request, type Response } from "express";
import z from "zod";
import { db, tableName } from "../data/dynamoDb.js";
import { channelItemSchema } from "../data/validation.js";
import type { ChannelItem, ChannelInput, errorResponse } from "../data/types.js";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { verifyToken } from "../data/auth.js";

const router = express.Router();



//Get all channels
//TODO!!!! remove any and add type
router.get("/", async (req: Request, res: Response<errorResponse | any>) => {
	try {
		//create scan command
		const command = new ScanCommand({
			TableName: tableName,
			FilterExpression: "begins_with(pk, :prefix)",
			ExpressionAttributeValues: {
				":prefix": "CHANNEL#",
			},
		})
		//get channels
		const result = await db.send(command);
		const parsedItems = channelItemSchema.array().safeParse(result.Items);

		//validate output
		if (!parsedItems.success) {
			const errorDetails = z.flattenError(parsedItems.error)
			console.error(errorDetails)
			console.log(result.Items)
			return res.status(400).send({ error: "error validating channel data" })
		}
		if (parsedItems.data.length === 0) {
			return res.status(400).send({ error: "No channels found" })
		}

		const frontendResponse = parsedItems.data.map(({ pk, name, isLocked, creatorId, createdAt }) => ({
			id: pk.replace('CHANNEL#', ''),
			name,
			isLocked,
			creatorId,
			createdAt
		}));
		return res.status(200).send(frontendResponse)

	} catch (error) {
		console.error("Error fetching channels", error)
		res.status(500).send({ error: "Internal server error" })
		return;
	}
});

//create a new channel
// router.post("/", verifyToken, async (req: Request, res: Response) => {

// });

export default router;