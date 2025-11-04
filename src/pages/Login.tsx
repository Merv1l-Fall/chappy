import "../styling/Login.css"
import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { useAuthStore } from "../store/LoginStore"
import { login, guestLogin } from "../api/user"

const Login = () => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")

	const authStore = useAuthStore()

	const handleGuestLogin = async () => {
		try {
			const data = await guestLogin()
			authStore.login(data.token)

			//TODO Redirect to dashboard or home page
	} catch (error) {
			console.error("Guest login failed:", error)
	}}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!username && !password) {
			setError("Please enter username and password");
			return;
		}

		if (!username) {
			setError("Please enter a username");
			return;
		}

		if (!password) {
			setError("Please enter a password");
			return;
		}

		try {
			const data = await login({ username, password })
			authStore.login(data.token)
			
			//TODO Redirect to dashboard or home page

		} catch (error) {
			console.error("Login failed:", error)
		}

	}
	return (
		<div className="login-container">
			<h1>Welcome to Chappy!</h1>
			<form className="login-form" onSubmit={handleSubmit}>
				<label htmlFor="username">Username</label>
				<input
					type="text"
					id="username"
					placeholder="Enter your username"
					name="username"
					value={username}
					onChange={(e: ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value) }}
				/>
				<label htmlFor="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					placeholder="Enter your password"
					value={password}
					onChange={(e: ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }}
				/>
				<span className="error-display">{error}</span>
				<div className="form-btn-container">
					<button className="login-btn form-btn" type="submit">
						Login
					</button>
					<button className="guest-btn form-btn"
					type="button"
					onClick={handleGuestLogin}>
						Continue as guest
					</button>
				</div>
			</form>
		</div>
	)
}

export default Login