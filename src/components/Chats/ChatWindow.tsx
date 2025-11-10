import { useState, useEffect } from "react";
import useChatStore from "../../store/ChatStore";
import { fetchMessages, sendMessage } from "../../api/messageApi";
import "../../styling/ChatWindow.css";
import MessageComponent from "../Message";
import { useAuthStore } from "../../store/LoginStore";

// interface ChatWindowProps {
// 	channelId?: string;
// 	recipientId?: string;
// 	// currentUserId: string;
// }

const ChatWindow = () => {
	const { messages, setMessages, activeChat } = useChatStore();
	const [input, setInput] = useState("");

	const currentUserId = useAuthStore().userId;

	useEffect(() => {
		if (!activeChat) return;
		setMessages([]);

		if (activeChat.type === "channel") {
			fetchMessages({ channelId: activeChat.id });
		} else {
			fetchMessages({ recipientId: activeChat.id });
		}
	}, [activeChat, setMessages]);

	const handleSend = async (e: React.FormEvent) => {
		e.preventDefault();
		 if (!input.trim() || !activeChat) return;

		await sendMessage({
			message: {parts: [{type: "text", content: input}]},
			channelId: activeChat.type === "channel" ? activeChat.id : undefined,
			recipientId: activeChat.type === "dm" ? activeChat.id : undefined,
		});
		setInput("");
	};

	return (
		<div className="chat-window-container">
		<div className="chat-window">
			<div className="chat-messages">
				{messages.length === 0 && <p className="no-messages">Wow... it's so empty here</p>}

				{messages
					.slice()
					.reverse()
					.map((msg) => (
						<MessageComponent key={msg.messageId} msg={msg} isOwn={msg.senderId === currentUserId} />
					))}
			</div>

		</div>

			{/* Input */}
			<form className="chat-input" onSubmit={handleSend}>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type a message..."
					className="message-field"
				/>
				<button type="submit" className="send-button">
					Send
				</button>
			</form>
		</div>
	);
};

export default ChatWindow;
