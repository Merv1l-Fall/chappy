import { apiClient } from "./clientHelper"
import useDashboardStore from "../store/DashboardStore"
import { useAuthStore } from "../store/LoginStore"
import type { DirectChat } from "../store/DashboardStore"

export interface LoginResponse {
	token: string
	userId: string
	accessLevel: "admin" | "user" | "guest"
}

export interface RegisterResponse {
	token: string
	userId: string
	accessLevel: "admin" | "user"
}

export interface LoginRequest {
	username: string
	password: string
}

async function login(data: LoginRequest): Promise<LoginResponse> {
	const res = await fetch("/api/user/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(`Login failed: ${errorData?.error}`);
	};
	return res.json();
};

async function guestLogin(): Promise<LoginResponse> {
	const res = await fetch("/api/user/guest-login", {
		method: "POST",
		headers: { "Content-type": "application/json" },
	});

	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(`Guest login failed: ${errorData?.error}`);
	};
	return res.json();
};

async function register(data: LoginRequest): Promise<RegisterResponse> {
	const res = await fetch("/api/user/register", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(`Registration failed: ${errorData?.error}`);
	};
	return res.json() ;
	
}

async function fetchUsersForDM() {
	console.log("fetching users for DM")
	const currentUserId = useAuthStore.getState().userId;
 	if (!currentUserId) return;

	const path = "/api/user"
	const res = await apiClient(path)
	console.log("API response for DM users:", res)
	
	const dmList: DirectChat[] = res.users
    .filter((userId: string) => userId !== currentUserId)
    .map((userId: string) => ({ otherUser: userId }));
	
	useDashboardStore.getState().setDMs(dmList)
	console.log("fethed users for DM;", useDashboardStore.getState().dms)
}

export { login, guestLogin, register, fetchUsersForDM };