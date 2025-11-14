import React from "react";
import "../../styling/CreateChannel.css"

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title?: string;
}

const Modal = ({ isOpen, onClose, children}: ModalProps) => {
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

export default Modal;
