import {create} from "zustand"

export type User = {
	userId: string
	accessLevel: "admin" | "user" | "guest"
	token: string
}

interface AuthState {
	user: User | null
	login: (user: User) => void
	logout: () => void
	isLoggedIn: () => boolean
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const accessLevel = localStorage.getItem("accessLevel") as User["accessLevel"];
    return token && userId && accessLevel ? { token, userId, accessLevel } : null;
  })(),

  login: (user: User) => {
    set({ user });
    localStorage.setItem("token", user.token);
    localStorage.setItem("userId", user.userId);
    localStorage.setItem("accessLevel", user.accessLevel);
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("accessLevel");
  },

  isLoggedIn: () => !!get().user,
}));

export { useAuthStore };