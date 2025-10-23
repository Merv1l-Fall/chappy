import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
const tableName = process.env.TABLE_NAME || "";

const client: DynamoDBClient = new DynamoDBClient({
  region: "eu-north-1",
  credentials: {
	accessKeyId: accessKeyId,
	secretAccessKey: secretAccessKey,
  },
});

const db: DynamoDBDocumentClient = DynamoDBDocumentClient.from(client);

export { db, tableName };