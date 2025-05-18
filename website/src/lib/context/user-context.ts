import type { User as TUser, Client, Seller } from "@/lib/types/prisma";
import { createContext } from "react";

type User = TUser & {
  client?: Client;
  seller?: Seller;
};

type UserContext = {
  user?: User;
  setUser: (user: User) => void;
};

export const userContext = createContext<UserContext>({
  user: undefined,
  setUser: () => {},
});
