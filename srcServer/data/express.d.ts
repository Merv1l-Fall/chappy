import { TokenPayload } from "./types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}