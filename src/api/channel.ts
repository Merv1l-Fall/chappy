import { apiClient } from "./clientHelper";
import useDashboardStore from "../store/DashboardStore";

// type Channel = {
//   id: string;
//   name: string;
//   isLocked: boolean;
// };


async function fetchChannels() {

	const path = "/api/channels"
	const channels = await apiClient(path)

	useDashboardStore.getState().setChannels(channels)
	console.log("fetched channels", channels)
}

export { fetchChannels }