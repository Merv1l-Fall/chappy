import ChatRow from "./ChatRow.js"

const ChatList = ({ items, view }: { items: any[]; view: "channels" | "dms" }) => (
  <>
    {view === "channels"
      ? items.map(c => <ChatRow key={c.name} label={c.name} isLocked={c.isLocked} />)
      : items.map(dm => <ChatRow key={dm.recipentName} label={dm.recipentName} />)
    }
  </>
);

export default ChatList;