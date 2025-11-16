import lock from "../../assets/lock.svg";
import trashCan from "../../assets/trashcan.svg";
import ProfilePic from "../ProfilePic";
import useChatStore from "../../store/ChatStore";
import { useAuthStore } from "../../store/LoginStore";
import { useState } from "react";
import Modal from "../createChannel/Modal";
import DeleteChannel from "../createChannel/DeleteChannel";

interface ChatRowProps {
	label: string;
	isLocked?: boolean;
	isChannelsView: boolean;
	creatorId?: string;
}

const ChatRow = ({ label, isLocked, isChannelsView, creatorId }: ChatRowProps) => {
	const chatStore = useChatStore();
	const accessLevel = useAuthStore().accessLevel;
	const userId = useAuthStore().userId;

	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	const canDelete = isChannelsView && creatorId === userId;

	const isDisabled = isChannelsView && isLocked && accessLevel === "guest";

	function handleOnClick() {
		// if (accessLevel === "guest") return
		if (isChannelsView) {
			chatStore.setActiveChat({ type: "channel", id: label.toLowerCase() });
		} else {
			chatStore.setActiveChat({ type: "dm", id: label.toLowerCase() });
		}
	}

	

	return (
		<div
			className={`chat-row ${isDisabled ? "disabled" : ""}`}
			onClick={isDisabled ? undefined : handleOnClick}
			aria-disabled={isDisabled}
			role="button"
		>
			{isChannelsView ? (
				// CHANNELS VIEW
				<>
					{isLocked ? (
						<img src={lock} alt="locked" style={{ width: "14px", marginRight: "6px" }} />
					) : (
						<span style={{ marginRight: "6px", opacity: 0.6 }}>#</span>
					)}
					<span>{label}</span>
					{canDelete && (
						<button
							className="delete-btn"
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								setIsDeleteOpen(true);
							}}
						>
							<img src={trashCan} />
						</button>
					)}
					<Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
						<DeleteChannel
							channelId={label.toLowerCase()}
							onClose={() => setIsDeleteOpen(false)}
							onDeleted={() => {}}
							// onDeleted={chatStore.}
						/>
					</Modal>
				</>
			) : (
				// DMS VIEW
				<>
					<ProfilePic name={label} size={2} />
					<span className="dm-name">{label}</span>
				</>
			)}
		</div>
	);
};

export default ChatRow;
