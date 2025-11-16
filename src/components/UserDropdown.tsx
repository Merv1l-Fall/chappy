import { useState, useEffect, useRef } from "react"
import { useAuthStore } from "../store/LoginStore"
import Modal from "./createChannel/Modal"
import DeleteUserPopup from "./DeleteUserPopup"
import "../styling/UserDropdown.css"

const UserDropdown = ({ onClose }: {onClose: () => void}) => {
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const userName = useAuthStore.getState().userId
	const accessLevel = useAuthStore.getState().accessLevel
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
	function handleClickOutside(e: MouseEvent) {
		if (isDeleteOpen) return;

		if (ref.current && !ref.current.contains(e.target as Node)) {
			onClose();
		}
	}

	document.addEventListener("mousedown", handleClickOutside);
	return () => document.removeEventListener("mousedown", handleClickOutside);
}, [onClose, isDeleteOpen]);



	return (
		<>
			<div ref={ref} className="user-dropdown">
				<p className="user-name">{userName}</p>
				<button
					className="delete-btn"
					disabled={accessLevel === "guest"}
					onClick={() => setIsDeleteOpen(true)}
				>
					Delete account
				</button>
			</div>
			
				<Modal isOpen={isDeleteOpen} onClose={() => (setIsDeleteOpen(false))}>
					<DeleteUserPopup onClose={() => setIsDeleteOpen(false)}/>
				</Modal>
			
		</>
	)
}

export default UserDropdown