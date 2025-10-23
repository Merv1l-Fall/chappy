import express from "express";
import type { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { createToken } from "../data/auth.js";
import { db, tableName } from "../data/dynamoDb.js";
import type { JwtResponse, UserBody, errorResponse } from "../data/types.js";
import { userInputSchema } from "../data/validation.js";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const router: Router = express.Router();

// Login endpoint
router.post("/", async (req: Request<UserBody | JwtResponse>, res: Response<JwtResponse | errorResponse>) => {
	const body: UserBody = req.body;

	const parsed = userInputSchema.safeParse(body);
	if (!parsed.success) {
		return  res.status(400).send({ error: "invalid Input"});
	}

	const command = new QueryCommand({
		TableName: tableName,
		KeyConditionExpression: "pk = :value",
		ExpressionAttributeValues: {
			":value": `USER#${body.username}`,
		},
	})

	try {
		const result =  await db.send(command);
		if (!result.Items) {
			console.log("User not found");
			res.sendStatus(404)
			return
		}

	} catch (error) {
		console.error("Error fetching user:", error);
		res.sendStatus(500);
		return;
	}
});
