import type { User } from "@/lib/types/prisma";
import { create } from "zustand";

type UserStore = {
  user?: User;
  set: (user: User) => void;
  delete: () => void;
};

export const userStore = create<UserStore>((set) => ({
  user: undefined,
  set: (user) => {
    set({ user });
  },
  delete: () => {
    set({ user: undefined });
  },
}));
