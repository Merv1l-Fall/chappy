import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

export type AccessLevel = "admin" | "user" | "guest";

export interface TokenPayload {
	userId: string;
	accessLevel: AccessLevel;
}

interface AuthState {
	userId: string | null;
	accessLevel: AccessLevel | null;
	token: string | null;
	login: (token: string) => void;
	logout: () => void;
	isLoggedIn: () => boolean;
}

const useAuthStore = create<AuthState>((set, get) => ({
	userId: (() => {
		const token = localStorage.getItem("token");
		if (!token) return null;
		const payload = jwtDecode<TokenPayload>(token);
		return payload.userId;
	})(),
	accessLevel: (() => {
		const token = localStorage.getItem("token");
		if (!token) return null;
		const payload = jwtDecode<TokenPayload>(token);
		return payload.accessLevel;
	})(),
	token: localStorage.getItem("token"),

	login: (token: string) => {
		const payload = jwtDecode<TokenPayload>(token);
		set({
			userId: payload.userId,
			accessLevel: payload.accessLevel,
			token,
		});
		localStorage.setItem("token", token);
		console.log("Login successful", payload.accessLevel, payload.userId)
	},

	logout: () => {
		set({ userId: null, accessLevel: null, token: null });
		localStorage.removeItem("token");
	},

	isLoggedIn: () => !!get().token,
}));

export { useAuthStore };
