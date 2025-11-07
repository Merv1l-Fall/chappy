import ProfilePic from "./ProfilePic"
import { useAuthStore } from "../store/LoginStore"
import { Link } from "react-router-dom"
import "../styling/Header.css"


const Header = () => {

	const { userId } = useAuthStore();
	return (
		<header className="header">
			<h1>Chappy</h1>
			<div className="header-inner-container">
				<div className="profile-container">
					<ProfilePic name={userId? userId : "Guest"} size={3} />
					<p className="name-text">{userId}</p>
				</div>
				<Link to={"/login"}>Logout</Link>
			</div>
		</header>
	)
}

export default Header