import express,{ type Request, type Response } from "express";
import { db, tableName } from "../data/dynamoDb.js";
import { channelItemSchema } from "../data/validation.js";
import type { ChannelItem, ChannelInput } from "../data/types.js";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const router = express.Router();

//Get all channels
router.get("/", async (req: Request, res: Response) => {
	try{
		const command = new ScanCommand({
			TableName: tableName,
			FilterExpression: "begins_with(pk :prefix)",
			ExpressionAttributeValues: {
				":prefix": { S: "Channel#"},
			},
		})
		const result = await db.send(command);
		const parsedItems = channelItemSchema.array().safeParse(result.Items);
		//TODO return array of channels

	}catch{

	}
});