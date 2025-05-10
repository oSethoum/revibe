import type { Comment } from "@/lib/types/prisma";
import { request } from "@/lib/api/request";

export const api = {
  comment: {
    create: async (body) =>
      request<Comment>("/seller/comments", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    remove: async (id: string) =>
      request<Comment>(`/seller/comments/${id}`, {
        method: "DELETE",
      }),
  },

  product: {
    create: async (body) =>
      request<Comment>("/seller/products", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    remove: async (id: string) =>
      request<Comment>(`/seller/products/${id}`, {
        method: "DELETE",
      }),
  },

  order: {
    update: async (id: string, body) =>
      request<Comment>(`/seller/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
  },
};
