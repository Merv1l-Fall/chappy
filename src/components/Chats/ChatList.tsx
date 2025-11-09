import ChatRow from "./ChatRow.js"

const ChatList = ({ items, view }: { items: any[]; view: "channels" | "dms" }) => (
  <div className="chats-list">
    {view === "channels"
      ? items.map(c => <ChatRow isChannelsView={true} key={c.name} label={c.name} isLocked={c.isLocked} />)
      : items.map(dm => <ChatRow isChannelsView={false} key={dm.otherUser} label={dm.otherUser} />)
    }
  </div>
);

export default ChatList;