import { useState } from "react";
import { createChannel } from "../../api/channel";
import { createChannelSchema } from "../../data/frontendValidation";
import "../../styling/CreateChannel.css"

const CreateChannel = ({ onClose }: { onClose?: () => void }) => {
	const [form, setForm] = useState<{ name: string; isLocked: boolean }>({
		name: "",
		isLocked: false,
	});

	const setName = (name: string) => setForm((prev) => ({ ...prev, name }));
	const setIsLocked = (isLocked: boolean) => setForm((prev) => ({ ...prev, isLocked }));
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		const parsed = createChannelSchema.safeParse(form);
		if (!parsed.success) {
			const firstError = parsed.error.issues[0].message;
			setError(firstError);
			return;
		}

		setIsLoading(true);
		try {
			await createChannel(form);
			setName("");
			setIsLocked(false);
			onClose?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : "failed to create channel");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="create-channel">
			<h3>Create a new channel</h3>
			<form onSubmit={handleSubmit}>
				<label htmlFor="name">Channel name</label>
				<input
					type="text"
					id="name"
					value={form.name}
					onChange={(e) => {
						setName(e.target.value);
					}}
				/>
				<div className="checkbox-container">

				<label htmlFor="isLocked">Locked Channel?
					</label>
				<input
					type="checkbox"
					id="isLocked"
					checked={form.isLocked}
					onChange={(e) => {
						setIsLocked(e.target.checked)
					}}
				/>
				</div>
				<span className="error">{error}</span>

				<div className="form-btns">
					<button type="submit" disabled={isLoading}>
						{" "}
						{isLoading ? "Creating..." : "Create"}{" "}
					</button>

					<button type="button" className="cancel" onClick={onClose}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateChannel
