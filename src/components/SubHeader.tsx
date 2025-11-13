import useChatStore from "../store/ChatStore"
import "../styling/Header.css"

const SubHeader = () => {
	
	const chatStore = useChatStore()
	

	return(
		<div className="sub-header">
			<h2>
				{chatStore.activeChat?.id.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
			</h2>
		</div>
	)

}

export default SubHeader