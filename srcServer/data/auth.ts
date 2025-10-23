import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from "express";
import type { TokenPayload } from './types.js';

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined in environment variables");
}
const JWT_SECRET: string = process.env.JWT_SECRET;

function createToken(userId: string, accessLevel: string): string {

	return jwt.sign({
		userId: userId,
		accessLevel: accessLevel,
	}, JWT_SECRET,{expiresIn: '15m'});	// Token expires in 15 minutes
}

function verifyToken(req: Request & { user?: TokenPayload }, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).send( { error: 'Missing or invalid Token' } );
	}

	const token = authHeader.substring(7);

	try {

		const decoded: TokenPayload = jwt.verify(token, JWT_SECRET) as TokenPayload;

		if (typeof decoded === "string" || !decoded) {
			return res.status(401).send( { error: 'Invalid Token' } );
		}

		if (typeof decoded.userId !== 'string' || typeof decoded.accessLevel !== 'string') {
			return res.status(401).send( { error: 'Invalid Token Payload' } );
		}
		req.user = decoded
		next();
	} catch (error) {
		console.error('Token verification failed:', error);
		return res.status(401).send( { error: 'Invalid or expired Token' } );

	}
}
	

export { createToken, verifyToken };