import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import "../styling/Register.css";
import { register } from "../api/user";
import { useAuthStore } from "../store/LoginStore";
import { Link } from "react-router-dom";
import { CreateAccountSchema } from "../data/frontendValidation";

const Register = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const authStore = useAuthStore();

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
		const inputs = { username, password };

		try {
			const parsed = CreateAccountSchema.safeParse(inputs);
			if (!parsed.success) {
				const firstError = parsed.error.issues[0].message;
				setError(firstError);
				return;
			}

			const data = await register( parsed.data );
			authStore.login(data.token);
			setError("");
		} catch (error) {
			console.error("Registration failed:", error);
			setError("Registration failed. Username may already be taken.");
		}
	};

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
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setUsername(e.target.value);
					}}
				/>
				<label htmlFor="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					placeholder="Enter your password"
					value={password}
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setPassword(e.target.value);
					}}
				/>
				<label htmlFor="confirm-password">Confirm password</label>
				<input
					type="password"
					id="confirm-password"
					name="confirm-password"
					placeholder="Confirm password"
					value={confirmPassword}
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setConfirmPassword(e.target.value);
					}}
				/>
				<span className="error-display">{error}</span>
				<div className="form-btn-container">
					<button className="register-btn form-btn" type="submit">
						Register
					</button>
					<Link to={"/login"} className="back-btn form-btn" type="button">
						Back to login
					</Link>
				</div>
			</form>
		</div>
	);
};

export default Register;
