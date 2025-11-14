import Header from "../components/Header"
import "../styling/Dashboard.css"
import ChatsBox from "../components/Chats/ChatsBox"
import useDashboardStore from "../store/DashboardStore.js"
import ChatWindow from "../components/Chats/ChatWindow.js"


const Dashboard = () => {

	const dashboardStore = useDashboardStore();

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