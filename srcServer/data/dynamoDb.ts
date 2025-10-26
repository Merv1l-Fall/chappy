import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const accessKeyId = process.env.ACCESS_KEY || "";
const secretAccessKey = process.env.SECRET_ACCESS_KEY || "";
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