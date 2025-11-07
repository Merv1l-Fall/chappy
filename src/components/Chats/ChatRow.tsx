
const ChatRow = ({ label, isLocked }: { label: string; isLocked?: boolean }) => (
  <div className="chatname-container">
    <p>{isLocked ? ` ${label}` : `# ${label}`}</p>
  </div>
);

export default ChatRow;