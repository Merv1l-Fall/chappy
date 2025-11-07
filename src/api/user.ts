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

export { login, guestLogin, register };