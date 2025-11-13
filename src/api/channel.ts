import { apiClient } from "./clientHelper";
import useDashboardStore from "../store/DashboardStore";

type ChannelInput = {
  name: string;
  isLocked: boolean;
};


async function fetchChannels() {

	const path = "/api/channels"
	const channels = await apiClient(path)

	useDashboardStore.getState().setChannels(channels)
	console.log("fetched channels", channels)
}

async function createChannel({name, isLocked}: ChannelInput) {
	const body = JSON.stringify({name, isLocked});

	const response = await apiClient("/api/channels", {
		method: "POST",
		body,
	})

	if(!response.channel) {
		throw new Error(response.error || "Failed to create channel")
	}

	const { channel } = response;

	const { channels, setChannels } = useDashboardStore.getState();
  setChannels([...channels, channel]);

  return channel;
}

export { fetchChannels, createChannel }