import "../styling/Login.css"
import { useState } from "react"
import type { ChangeEvent } from "react"

const Login = () => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	return (
		<div className="login-container">
			<h1>Welcome to Chappy!</h1>
			<form className="login-form">
				<label htmlFor="username">Username</label>
				<input
				type="text" 
				id="username"
				placeholder="Enter your username"
				name="username"
				value={username} 
				onChange={(e: ChangeEvent<HTMLInputElement>) => {setUsername(e.target.value)}}
				/>
				<label htmlFor="password">Password</label>
				<input 
				type="password" 
				id="password" 
				name="password" 
				placeholder="Enter your password"
				value={password}
				onChange={(e: ChangeEvent<HTMLInputElement>) => {setPassword(e.target.value)}}
				/>
				<div className="form-btn-container">
					<button className="login-btn form-btn" type="submit">
						Login
					</button>
					<button className="guest-btn form-btn">
						Continue as guest
					</button>
				</div>
			</form>
		</div>
	)
}

export default Login