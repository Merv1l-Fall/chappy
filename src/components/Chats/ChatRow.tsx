import lock from "../../assets/lock.svg";
import ProfilePic from "../ProfilePic";
import useChatStore from "../../store/ChatStore";
import { useAuthStore } from "../../store/LoginStore";

interface ChatRowProps  {
	label: string;
	isLocked?: boolean;
	isChannelsView: boolean;
}


const ChatRow = ({ label, isLocked, isChannelsView }: ChatRowProps) => {
const chatStore = useChatStore();
const accessLevel = useAuthStore().accessLevel;
// const userId = useAuthStore().userId;

const isDisabled = isChannelsView && isLocked && accessLevel === "guest";

function handleOnClick(){
	// if (accessLevel === "guest") return
	if (isChannelsView) {
		chatStore.setActiveChat({ type: "channel", id: label.toLowerCase()})
	} else {
		chatStore.setActiveChat({ type: "dm", id: label.toLowerCase()})
	}
}



return (
 <div className={`chat-row ${isDisabled ? "disabled" : ""}`} onClick={isDisabled ? undefined : handleOnClick} aria-disabled={isDisabled} role="button">
    
    {isChannelsView ? (
      // CHANNELS VIEW
      <>
        {isLocked ? (
          <img src={lock} alt="locked" style={{ width: "14px", marginRight: "6px" }} />
        ) : (
          <span style={{ marginRight: "6px", opacity: 0.6 }}>#</span>
        )}
        <span>{label}</span>
      </>
    ) : (
      // DMS VIEW
      <>
        <ProfilePic name={label} size={2} />
        <span className="dm-name">{label}</span>
      </>
    )}

  </div>

)	
};

export default ChatRow;