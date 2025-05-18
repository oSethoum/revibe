import type { User, Seller, Client } from "@/lib/types/prisma";
import { create } from "zustand";

type UserStore = {
  user?: User & { seller?: Seller; client?: Client };
  refresh: () => void;
  setUser: (user: User) => void;
  logout: () => void;
};

export const userStore = create<UserStore>((set) => ({
  user: undefined,
  setUser: (user) => {
    set({ user });
  },
  refresh: () => {},
  logout: () => {
    set({ user: undefined });
    localStorage.removeItem("user");
  },
}));
