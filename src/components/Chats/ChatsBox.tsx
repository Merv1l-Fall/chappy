import { useState } from "react"
import ChatList from "./ChatList"
import "../../styling/ChatsBox.css"
import { useAuthStore } from "../../store/LoginStore.js"
import type { Channel, DirectChat } from "../../store/DashboardStore.js"
import CreateChannel from "../createChannel/CreateChannel.js"
import CreateChannelModal from "../createChannel/CreateChannelOverlay.js"

interface ChatsBoxProps {
	channels: Channel[];
	dms: DirectChat[];
}

const ChatsBox = ({channels, dms}: ChatsBoxProps) => {
	const [isChannelsView, setIsChannelsView] = useState(true);
	const [isOverlay, setIsOverlay] = useState(false)
	const authStore = useAuthStore();

	const [isGuest] = useState( authStore.accessLevel === "guest")

	return(
		<div className="ChatsBox">
			<div className="page-switcher">
				<button onClick={() => {setIsChannelsView(true)}} className={isChannelsView? "active" : ""}> Channels </button>
				<button disabled={isGuest} onClick={() => {setIsChannelsView(false)}} className={isChannelsView? "" : "active"}> DMs </button>
			</div>
			<div className="chatsbox-middle-container">
			<h2>{isChannelsView ? "Channels" : "Direct Messages"}</h2>
			{!isGuest && isChannelsView && <button className="create-channel-btn" onClick={() => {setIsOverlay(true)}}>+ Channel</button>}
			</div>
			<div className="chats-container">
				<ChatList items={isChannelsView ? channels : dms} view={isChannelsView ? "channels" : "dms"} />
			</div>

			<CreateChannelModal isOpen={isOverlay} onClose={() => setIsOverlay(false)}>
				<CreateChannel onClose={() => setIsOverlay(false)}/>
			</CreateChannelModal>
		</div>
	)
}

export default ChatsBox