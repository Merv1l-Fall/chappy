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

export interface ChannelInput {
	name: string;
	isLocked: boolean;
	creatorId: string
}

export interface ChannelItem{
	pk: string;
	sk: string;
	name: string;
	isLocked: boolean;
	creatorId: string;
	createdAT: string;
}

export interface errorResponse {
	error: string;
	details?: any;
}