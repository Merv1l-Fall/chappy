import { create } from "zustand";

export type Message = {
  messageId: string;
  senderId: string;
  message: {
    parts: { type: "text" | "image"; content: string }[];
  };
  timestamp: string;
};

type ActiveChat = {
  type: "channel" | "dm";
  id: string;
} | null;

type ChatState = {
  messages: Message[];
  activeChat: ActiveChat;
  isLoading: boolean;
  setMessages: (messages: Message[]) => void;
  setActiveChat: (chat: ActiveChat) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
};

const initialState = {
  messages: [] as Message[],
  activeChat: null as ActiveChat,
  isLoading: false,
};

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  activeChat: null,
  isLoading: false,
  setMessages: (messages) => set({ messages }),
  setActiveChat: (chat) => set({ activeChat: chat }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  reset: () => set(() => ({ 
    messages: initialState.messages, 
    activeChat: initialState.activeChat, 
    isLoading: initialState.isLoading 
  })),
}));

export default useChatStore;
