import { useState } from "react"
import { deleteUser } from "../api/user"
import "../styling/DeleteUserPopup.css"
import { Logout } from "../api/user"
import { useNavigate } from "react-router-dom"



const DeleteUserPopup = ({ onClose }: { onClose?: () => void }) => {
	const [status, setStatus] = useState("")
	const [form, setForm] = useState({ password: "", confirmPassword: "" })
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const handleLogout = () => {
		Logout()
		navigate("/")
	}


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setStatus("")
		if (form.password !== form.confirmPassword) {
			setStatus("Passwords do not match")
			setIsLoading(false)
			return
		}
		try {
			await deleteUser(form.password)
			setStatus("Account removed")
			handleLogout()

		} catch(error) {
			setStatus("Failed to delete user, try again later")
		} finally{
			setIsLoading(false)
		}
		
	}

	const handleCancel = () => {
		setStatus("")
		setForm({password: "", confirmPassword: ""})
		onClose?.()
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// setIsLoading(false)
		setStatus("");
		const { name, value } = e.target
		setForm(prev => ({ ...prev, [name]: value }))
	}

	return (
		<div className="delete-modal">
			<p className="delete-info">Please enter your password to remove account</p>
					<form className="delete-form" onSubmit={handleSubmit}>
						<div>
							<label htmlFor="password">Password</label>
							<input
								type="password"
								id="password"
								name="password"
								value={form.password}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label htmlFor="confirm-password">Confirm password</label>
							<input
								type="password"
								id="confirm-password"
								name="confirmPassword"
								value={form.confirmPassword}
								onChange={handleChange}
							/>
						</div>
						<p className="error">{status}</p>
						<div className="delete-btn-container">
						<button type="submit" className="delete" disabled={isLoading}>Delete</button>
						<button type="button" onClick={() => handleCancel()} disabled={isLoading}>Cancel </button>
						</div>
					</form>
		</div>
	)
}

export default DeleteUserPopup