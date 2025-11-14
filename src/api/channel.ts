import { apiClient } from "./clientHelper";
import useDashboardStore from "../store/DashboardStore";

type ChannelInput = {
	name: string;
	isLocked: boolean;
};


const path = "/api/channels";

async function fetchChannels() {
	const channels = await apiClient(path);

	useDashboardStore.getState().setChannels(channels);
	console.log("fetched channels", channels);
}

async function createChannel({ name, isLocked }: ChannelInput) {
	const body = JSON.stringify({ name, isLocked });

	const response = await apiClient(path, {
		method: "POST",
		body,
	});

	if (!response.channel) {
		throw new Error(response.error || "Failed to create channel");
	}

	const { channel } = response;

	const { channels, setChannels } = useDashboardStore.getState();
	setChannels([...channels, channel]);

	return channel;
}

async function deleteChannel( channelId: string) {
	const response = await apiClient(`${path}/${channelId}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to delete channel");
	}
	return response.json();
}

export { fetchChannels, createChannel, deleteChannel };
