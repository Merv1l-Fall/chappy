export interface LoginResponse {
	token: string
	userId: string
	accessLevel: "admin" | "user" | "guest"
}

export interface LoginRequest {
	username: string
	password: string
}

async function login(data: LoginRequest): Promise<LoginResponse>{
	const res = await fetch("/api/user/login", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(`Login failed: ${errorData?.error}`);

	}
	return res.json();
};

export { login };