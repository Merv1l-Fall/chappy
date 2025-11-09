import { create } from "zustand";

export interface Channel {
  name: string;
  isLocked: boolean;
}

export interface DirectChat {
//   id: string; // like DM#user1#user2
  otherUser: string;
}

interface SidebarState {
  channels: Channel[];
  dms: DirectChat[];
  setChannels: (channels: Channel[]) => void;
  setDMs: (dms: DirectChat[]) => void;
}

const useDashboardStore = create<SidebarState>((set) => ({
  channels: [],
  dms: [],
  setChannels: (channels) => set({ channels }),
  setDMs: (dms) => set({ dms }),
}));

export default useDashboardStore;