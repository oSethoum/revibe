import type { User } from "../types/prisma";
import { request } from "./request";

const api = {
  Login: async (body) => {
    return request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  register: async (body) => {
    return request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  refresh: async () => {
    return request<{ token: string; user: User }>("/auth/refresh", {
      method: "GET",
    });
  },

  logout: async () => {
    return request<{ token: string; user: User }>("/auth/logout", {
      method: "GET",
    });
  },
};

export default api;
