import { useState } from "react"
import ChatList from "./ChatList"
import "../../styling/ChatsBox.css"
import { useAuthStore } from "../../store/LoginStore.js"
import type { Channel, DirectChat } from "../../store/DashboardStore.js"


interface ChatsBoxProps {
	channels: Channel[];
	dms: DirectChat[];
}

const ChatsBox = ({channels, dms}: ChatsBoxProps) => {
	const [isChannelsView, setIsChannelsView] = useState(true);
	const authStore = useAuthStore();

	const [isGuest] = useState( authStore.accessLevel === "guest")

	return(
		<div className="ChatsBox">
			<div className="page-switcher">
				<button onClick={() => {setIsChannelsView(true)}} className={isChannelsView? "active" : ""}> Channels </button>
				<button disabled={isGuest} onClick={() => {setIsChannelsView(false)}} className={isChannelsView? "" : "active"}> DMs </button>
			</div>
			<h2>{isChannelsView ? "Channels" : "Direct Messages"}</h2>
			<div className="chats-container">
				<ChatList items={isChannelsView ? channels : dms} view={isChannelsView ? "channels" : "dms"} />
			</div>
		</div>
	)
}

export default ChatsBox