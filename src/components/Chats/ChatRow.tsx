import lock from "../../assets/lock.svg";
import ProfilePic from "../ProfilePic";
import useChatStore from "../../store/ChatStore";

interface ChatRowProps  {
	label: string;
	isLocked?: boolean;
	isChannelsView: boolean;
}


const ChatRow = ({ label, isLocked, isChannelsView }: ChatRowProps) => {
const chatStore = useChatStore();

function setChannel(){
	chatStore.setActiveChat({ type: "channel", id: label})
}

function setDM(){
	chatStore.setActiveChat({ type: "dm", id: label})
}


return (
 <div className="chat-row">
    
    {isChannelsView ? (
      // CHANNELS VIEW
      <div onClick={setChannel}>
        {isLocked ? (
          <img src={lock} alt="locked" style={{ width: "14px", marginRight: "6px" }} />
        ) : (
          <span style={{ marginRight: "6px", opacity: 0.6 }}>#</span>
        )}
        <span>{label}</span>
      </div>
    ) : (
      // DMS VIEW
      <div onClick={setDM}>
        <ProfilePic name={label} size={2} />
        <span className="dm-name">{label}</span>
      </div>
    )}

  </div>

)	
};

export default ChatRow;