import Header from "../components/Header"
import "../styling/Dashboard.css"
import ChatsBox from "../components/Chats/ChatsBox"
import useDashboardStore from "../store/DashboardStore.js"
import ChatWindow from "../components/Chats/ChatWindow.js"

const Dashboard = () => {

	const dashboardStore = useDashboardStore();

	const testChannels = [
		{ name: "general", isLocked: false },
		{ name: "random", isLocked: false },
		{ name: "project-discussion", isLocked: true },
	]
	
	const testDms = [
		{ otherUser: "alice", id: "DM#vilmer#alice" },
		{ otherUser: "bob",  id: "DM#vilmer#bob"  },
		{ otherUser: "charlie", id: "DM#vilmer#charlie"   },
	]

	// For testing purposes, set some dummy channels and DMs
	if (dashboardStore.channels.length === 0 && dashboardStore.dms.length == 0 ) {
		dashboardStore.setChannels(testChannels)
		dashboardStore.setDMs(testDms)
	}

	return (
		<div className="dashboard-container">
			<Header />
			<main>
				<ChatsBox channels={dashboardStore.channels} dms={dashboardStore.dms}/>
				<ChatWindow/>
			</main>

		</div>
	)
}

export default Dashboard