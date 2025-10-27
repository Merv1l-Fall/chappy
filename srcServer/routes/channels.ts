import express,{ type Request, type Response } from "express";
import z from "zod";
import { db, tableName } from "../data/dynamoDb.js";
import { channelItemSchema } from "../data/validation.js";
import type { ChannelItem, ChannelInput, errorResponse } from "../data/types.js";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { verifyToken } from "../data/auth.js";

const router = express.Router();



//Get all channels
router.get("/", async (req: Request, res: Response<errorResponse | ChannelItem[]>) => {
	try{
		//create scan command
		const command = new ScanCommand({
			TableName: tableName,
			FilterExpression: "begins_with(pk :prefix)",
			ExpressionAttributeValues: {
				":prefix": { S: "Channel#"},
			},
		})
		//get channels
		const result = await db.send(command);
		const parsedItems = channelItemSchema.array().safeParse(result.Items);

		//validate output
		if(!parsedItems.success){
			const errorDetails = z.flattenError(parsedItems.error)
			return res.status(400).send({error: "error validating channel data", details: errorDetails})
		}
		if(parsedItems.data.length === 0) {
			return res.status(400).send({error: "No channels found"})
		}

		return res.status(200).send(parsedItems.data)

	}catch(error){
		console.error("Error fetching channels", error)
		res.status(500).send({error: "Internal server error"})
		return;
	}
});

//create a new channel
router.post("/", verifyToken, async (req: Request, res: Response) => {
	
});