import { useState } from "react"
import ChatList from "./ChatList"

interface ChatsBoxProps {
	channels: { name: string; isLocked: boolean }[];
	dms: { recipentName: string;}[];
}

const testChannels = [
	{ name: "general", isLocked: false },
	{ name: "random", isLocked: false },
	{ name: "project-discussion", isLocked: true },
]

const testDms = [
	{ recipentName: "Alice" },
	{ recipentName: "Bob" },
	{ recipentName: "Charlie" },
]

const ChatsBox = ({channels, dms}: ChatsBoxProps) => {

	channels = channels || testChannels;
	dms = dms || testDms;
	const [isChannelsView, setIsChannelsView] = useState(true);

	return(
		<div className="ChatsBox">
			<div className="page-switcher">
				<button onClick={() => {setIsChannelsView(true)}} className={isChannelsView? "active" : ""}> Channels </button>
				<button onClick={() => {setIsChannelsView(false)}} className={isChannelsView? "" : "active"}> DMs </button>
			</div>
			<h2>{isChannelsView ? "Channels" : "Direct Messages"}</h2>
			<div className="chats-container">
				<ChatList items={isChannelsView ? channels : dms} view={isChannelsView ? "channels" : "dms"} />
			</div>
		</div>
	)
}

export default ChatsBox