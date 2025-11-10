import { apiClient } from "./clientHelper";
import type { Message } from "../store/ChatStore";
import useChatStore from "../store/ChatStore";

async function fetchMessages({channelId, recipientId}: {channelId?: string; recipientId?: string}) {

	if((!channelId && !recipientId) || (recipientId && channelId)) {
		throw new Error("Exactly one of channelId or recipientId must be provided")
	}

	//create fetch params
	const params = new URLSearchParams
	if (channelId) params.append("channelId", channelId)
	if (recipientId) params.append("recipientId", recipientId)

	const path = `/api/message?${params.toString()}`;
	const messages: Message[] = await apiClient(path)

	useChatStore.getState().setMessages(messages);
	console.log("Fetched messages:", messages.length)
}

async function sendMessage({message, channelId, recipientId}: { message: any; channelId?: string; recipientId?: string; }) {

	if((!channelId && !recipientId) || (recipientId && channelId)) {
		throw new Error("Exactly one of channelId or recipientId must be provided")
	}
	
	const body = JSON.stringify({message, channelId, recipientId})

	const newMessage: Message = await apiClient("/api/message", {
		method: "POST",
		body,
	});

	// Optimistic update (prepend new message)
  	const { messages, setMessages } = useChatStore.getState();
 	setMessages([newMessage, ...messages]);
  	console.log("Sent message:", newMessage);
}

export { fetchMessages, sendMessage}