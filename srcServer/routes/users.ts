import express from "express";
import z from "zod";
import type { Router, Response } from "express";
import bcrypt from "bcrypt";
import { createToken, verifyToken } from "../data/auth.js";
import { db, tableName } from "../data/dynamoDb.js";
import type { JwtResponse, successResponse, UserBody, UserItem, errorResponse, RequestBody } from "../data/types.js";
import { userInputSchema, userItemSchema } from "../data/validation.js";
import { PutCommand, QueryCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const router: Router = express.Router();

// Login endpoint
router.post("/login", async (req: RequestBody<UserBody>, res: Response<JwtResponse | errorResponse>) => {
	const body: UserBody = req.body;

	// Validate input
	const parsed = userInputSchema.safeParse(body);
	if (!parsed.success) {
		const errorDetails = z.flattenError(parsed.error);
		return  res.status(400).send({ error: "invalid Input", details: errorDetails });
	}

	try {
	const command = new QueryCommand({
		TableName: tableName,
		KeyConditionExpression: "pk = :value",
		ExpressionAttributeValues: {
			":value": `USER#${body.username.toLowerCase()}`,
		},
	});
		//Check if user exists
		const result =  await db.send(command);
		const parsedItems = userItemSchema.array().safeParse(result.Items);

		if (!parsedItems.success || parsedItems.data.length === 0) {
			console.log("User not found or invalid data");
			res.status(401).send({ error: "invalid username or password",  });
			return;
		}

		// TypeScript thing ensure user is of type UserItem
		const user = parsedItems.data[0];
		if (!user) {
			return res.status(404).send({ error: "User not found" });
		}

		// Compare passwords
		const passwordMatch = await bcrypt.compare(body.password, user.passwordHash);
		if (!passwordMatch) {
			console.log("Invalid password");
			res.status(401).send({ error: "Invalid username or password" });
			return;
		}
		
		// Create JWT token
		const token = createToken(user.pk.substring(5), user.accessLevel);
		return res.status(200).send({ success: true, token });

	} catch (error) {
		console.error("Error fetching user:", error);
		res.status(500).send({ error: "Internal server error" });
		return;
	}
});

//register
router.post("/register", async (req: RequestBody<UserBody>, res: Response<JwtResponse | errorResponse>) => {
	
	// Validate input
	const body: UserBody = req.body;
	const parsed = userInputSchema.safeParse(body);
	if (!parsed.success) {
		const errorDetails = z.flattenError(parsed.error);
		return  res.status(400).send({ error: "invalid Input", details: errorDetails });
	}

	try {
		// Check if user already exists
		const checkCommand = new QueryCommand({
			TableName: tableName,
			KeyConditionExpression: "pk = :value",
			ExpressionAttributeValues: {
				":value": `USER#${body.username.toLowerCase()}`,
			},
		});
		const checkResult = await db.send(checkCommand);
		if (checkResult.Items && checkResult.Items.length > 0) {
			return res.status(401).send({ error: "User already exists" });
		}

		// Hash the password
		const passwordHash = await bcrypt.hash(body.password, 10);
		// Create new user item
		const newUser: UserItem = {
			pk: `USER#${body.username.toLowerCase()}`,
			sk: "METADATA",
			username: body.username.toLowerCase(),
			passwordHash,
			accessLevel: "user",
		};

		// Store the new user in the database
		const command = new PutCommand({
			TableName: tableName,
			Item: newUser,
		});

		const result = await db.send(command);

		//Log the new user
		console.log("New user created:", result);

		// Create JWT token for the new user
		const token = createToken(newUser.pk.substring(5), newUser.accessLevel);
		return res.status(201).send({ success: true, token });

	} catch (error) {
		console.error("Error registering a new user:", error);
		return res.status(500).send({ error: "Internal server error" });
	}
});

//Delete your own account
router.delete("/delete", verifyToken, async (req: RequestBody<{password: string }>, res:  Response<successResponse | errorResponse>) => {

	//for security reasons, require password to delete account
	const {password} = req.body;
	//validate
	if(!password) {
		return res.status(400).send({error: "Password required"})
	}
	//get username(userId) from JWT
	const username = req.user?.userId
	console.log(username)
	//validate
	if(!username) {
		return res.status(401).send({ error: "Invalid or expired token payload" });
	}


	try {
		// Check if user exists
		const getUserCommand = new GetCommand({
			TableName: tableName,
			Key: {pk: `USER#${username.toLowerCase()}`, sk: "METADATA"}
		});
		const result = await db.send(getUserCommand);
		if(!result.Item){
			return res.status(404).send({ error: "User not found" });	
		}
		
		const user = userItemSchema.parse(result.Item)

		// Compare passwords
		const passwordMatch = await bcrypt.compare(password, user.passwordHash);
		if (!passwordMatch) {
			return res.status(401).send({ error: "Invalid username or password" });
		}
		// Delete user
		const deleteCommand = new DeleteCommand({
			TableName: tableName,
			Key: {
				pk: user.pk,
				sk: user.sk,
			},
		});

		await db.send(deleteCommand);
		return res.status(200).send({ success: true, message: "Account deleted successfully" });
	
	} catch (error) {
		console.error("Error deleting user:", error);
		return res.status(500).send({ error: "Internal server error" });
	}
});

export default router;
