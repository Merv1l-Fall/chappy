import { create } from "zustand";

export interface Channel {
  name: string;
  isLocked: boolean;
  creatorId: string;
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
  reset: () => void;
}

const initialState = {
  channels: [] as Channel[],
  dms: [] as DirectChat[],
};

const useDashboardStore = create<SidebarState>((set) => ({
  channels: [],
  dms: [],
  setChannels: (channels) => set({ channels }),
  setDMs: (dms) => set({ dms }),
  reset: () => set(() => ({ channels: initialState.channels, dms: initialState.dms })),
}));

export default useDashboardStore;