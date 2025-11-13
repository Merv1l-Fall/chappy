import React from "react";
import "../../styling/CreateChannel.css"

const CreateChannelModal = ({
	isOpen,
	onClose,
	children,
}: {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}) => {
	if (!isOpen) return null;

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div
				className="modal-content"
				onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
			>
				<button className="modal-close" onClick={onClose}>
					✕
				</button>
				{children}
			</div>
		</div>
	);
};

export default CreateChannelModal;
