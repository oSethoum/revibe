import { request } from "@/lib/api/request";
import type { Category } from "@/lib/types/prisma";

const api = {
  category: {
    query: async () => {
      return request<Category[]>("/categories", {
        method: "GET",
      });
    },
  },

  product: {
    query: async (query) => {
      return request<Category[]>(`/products/`, {
        method: "QUERY",
        body: JSON.stringify(query),
      });
    },
  },

  order: {
    create: async (body) =>
      request<Comment>("/orders", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
};

export default api;
