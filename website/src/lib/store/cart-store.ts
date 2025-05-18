import type { Product, User } from "@/lib/types/prisma";
import { create } from "zustand";

type CartStore = {
  items: Array<{
    product: Product;
    quantity: number;
    attributes?: Record<string, string>;
  }>;
  count: () => number;
  addProduct: (product: Product, attributes?: Record<string, string>) => void;
  removeProduct: (index: number) => void;
  incrementQuantity: (index: number) => void;
  decrementQuantity: (index: number) => void;
};

export const cartStore = create<CartStore>((set) => ({
  items: [],
  addProduct: (product, attributes) => {
    set((current) => ({
      items: [...current.items, { product, quantity: 1, attributes }],
    }));
  },
  count: () => {
    return cartStore
      .getState()
      .items.reduce((acc, item) => acc + item.quantity, 0);
  },
  incrementQuantity: (index: number) => {
    set((current) => ({
      items: current.items.map((item, i) => {
        if (i === index) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      }),
    }));
  },
  decrementQuantity: (index: number) => {
    set((current) => ({
      items: current.items.map((item, i) => {
        if (i === index) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }),
    }));
  },
  removeProduct: (index: number) => {
    set((current) => ({
      items: current.items.filter((_, i) => i !== index),
    }));
  },
}));
