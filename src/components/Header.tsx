import ProfilePic from "./ProfilePic"
import { useAuthStore } from "../store/LoginStore"
import { Link } from "react-router-dom"
import { Logout } from "../api/user"
import "../styling/Header.css"
import UserDropdown from "./UserDropdown"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


const Header = () => {
	const [isDropdown, setIsDropdown] = useState(false)
	const navigate = useNavigate();
	const { userId } = useAuthStore();

	const handleLogout = () => {
		Logout()
		navigate("/")
	}
	
	return (
		<header className="header">
			<h1>Chappy</h1>
			<div className="header-inner-container">
				<div onClick={() => (setIsDropdown(true))} className="profile-container">
					<ProfilePic name={userId? userId : "Guest"} size={3} />
					<p className="name-text">{userId}</p>

				</div>
				<Link to={"/login"} onClick={handleLogout}>Logout</Link>
			{isDropdown && <UserDropdown onClose={() => setIsDropdown(false)} />}
			</div>
		</header>
	)
}

export default Header