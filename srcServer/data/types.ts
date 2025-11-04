import type { Request } from "express";

//Token
export interface TokenPayload{
	userId: string;
	accessLevel: string;
}
export interface JwtResponse {
	success: boolean;
	token: string;
}

//Users
export interface UserBody {
	username: string;
	password: string;
}

export interface UserItem {
	pk: string;
	sk: string;
	username: string;
	passwordHash: string;
	accessLevel: string;
}

//Channel
export interface ChannelInput {
	name: string;
	isLocked: boolean;
}

export interface ChannelItem{
	pk: string;
	sk: string;
	name: string;
	isLocked: boolean;
	creatorId: string;
	createdAt: string;
}

//Message
export interface MessageItem {
  pk: string;
  sk: string;
  senderId: string;
  message: {
    parts: {
      type: "text" | "image";
      content: string;
      metadata?: Record<string, any> | undefined;
    }[];
  };
  timestamp: string;
}

export interface MessageBodyInput{
	channelId?: string;      // required if sending to a channel
  recipientId?: string;    //required if sending a DM
	message: {
		parts:{
			type: "text" | "image";
			content: string
			metadata?: Record<string, any>;
		}[];
	}
}



//Response
export interface errorResponse {
	error: string;
	details?: any;
}

export interface successResponse {
	message: string;
	success: boolean;
}

//request
export type RequestBody<T> = Request<{}, {}, T>;
export type RequestQuery<T> = Request<{}, {}, {}, T>;