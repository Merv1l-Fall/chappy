export interface TokenPayload{
	userId: string;
	accessLevel: string;
}

export interface UserBody {
	username: string;
	password: string;
}

export interface JwtResponse {
	success: boolean;
	token: string;
}

export interface UserItem {
	pk: string;
	sk: string;
	username: string;
	passwordHash: string;
	accessLevel: string;
}

export interface errorResponse {
	error: string;
}