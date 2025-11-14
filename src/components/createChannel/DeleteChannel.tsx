import "../../styling/DeleteChannel.css";
import { deleteChannel } from "../../api/channel";
import { useState } from "react";

const DeleteChannel = ({ onClose, channelId, onDeleted }: { onClose?: () => void; channelId: string; onDeleted?: () => void; }) => {

	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState("");
	const [success, setSuccess] = useState(false)

	const handleConfirm = async () => {
		setIsLoading(true)
		setStatus("")
		setSuccess(false)

		try {
			await deleteChannel(channelId)
			onDeleted?.()
			setStatus("Channel deleted")
			setSuccess(true)
		} catch (err: any) {
			setStatus("Failed to delete channel, try again later")
			
		} finally {
			setIsLoading(false)
		}
	}
	return (
		<div className="delete-channel">
			<h3>Are you sure you want to delete {channelId}</h3>
			<div>
				<button className="cnofirm-btn" onClick={handleConfirm} disabled={isLoading}>{isLoading? "Deleteing..." : "Confirm"}</button>
				<button className="cancel-btn" onClick={onClose} disabled={isLoading}>{success? "Close" : "Cancel"}</button>
			</div>
			<span className="status-display">{status}</span>
		</div>
	);
};

export default DeleteChannel;
