import type { Message } from "../store/ChatStore";
import "../styling/Message.css";
import ProfilePic from "../components/ProfilePic";

interface MessageProps {
	msg: Message;
	isOwn: boolean;
}

const MessageComponent = ({ msg, isOwn }: MessageProps) => {
	return (
		<div className={`message ${isOwn ? "sent" : "received"}`}>
			{ !isOwn && <ProfilePic name={msg.senderId} size={2} />}
			<div className="message-bubble">
				{msg.message.parts.map((part, index) => {
					if (part.type === "text") {
						return (
							<p key={index} className="message-text">
								{part.content}
							</p>
						);
					}

					if (part.type === "image") {
						return <img key={index} src={part.content} alt="message content" className="message-image" />;
					}

					return null;
				})}
				<p className="message-time">{msg.timestamp}</p>
			</div>
			{ isOwn && <ProfilePic name={msg.senderId} size={2} />}
		</div>
	);
};

export default MessageComponent;
