import lock from "../../assets/lock.svg";
import ProfilePic from "../ProfilePic";

interface ChatRowProps  {
	label: string;
	isLocked?: boolean;
	isChannelsView: boolean;
}


const ChatRow = ({ label, isLocked, isChannelsView }: ChatRowProps) => (
 <div className="chat-row">
    
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
);

export default ChatRow;