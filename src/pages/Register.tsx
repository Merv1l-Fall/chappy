import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import "../styling/Register.css"

const Register = () => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")

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

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
	}

	return (
		<div className="register-container">
			<h1>Welcome to Chappy!</h1>
			<form className="register-form" onSubmit={handleSubmit}>
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
				<label htmlFor="confirm-password">Confirm password</label>
				<input
					type="password"
					id="confirm-password"
					name="confirm-password"
					placeholder="Confirm password"
					value={confirmPassword}
					onChange={(e: ChangeEvent<HTMLInputElement>) => { setConfirmPassword(e.target.value) }}
				/>
				<span className="error-display">{error}</span>
				<div className="form-btn-container">
					<button className="register-btn form-btn" type="submit">
						Register
					</button>
					<button className="back-btn form-btn"
						type="button"
						onClick={() => {
							//TODO Redirect to login page
						}}>
						Back to login
					</button>
				</div>
			</form>
		</div>
	)
}

export default Register