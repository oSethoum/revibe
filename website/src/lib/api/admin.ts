import * as T from "@/lib/types/prisma";
import { request } from "./request";

type API = {
  category: {
    type: T.Category;
    query: T.Prisma.CategoryFindManyArgs;
    create: T.Prisma.CategoryCreateArgs;
    update: T.Prisma.CategoryUpdateArgs;
    delete: T.Prisma.CategoryDeleteArgs;
  };
  product: {
    type: T.Product;
    query: T.Prisma.ProductFindManyArgs;
    create: T.Prisma.ProductCreateArgs;
    update: T.Prisma.ProductUpdateArgs;
    delete: T.Prisma.ProductDeleteArgs;
  };
  user: {
    type: T.User;
    query: T.Prisma.UserFindManyArgs;
    create: T.Prisma.UserCreateArgs;
    update: T.Prisma.UserUpdateArgs;
    delete: T.Prisma.UserDeleteArgs;
  };
  order: {
    type: T.Order;
    query: T.Prisma.OrderFindManyArgs;
    create: T.Prisma.OrderCreateArgs;
    update: T.Prisma.OrderUpdateArgs;
    delete: T.Prisma.OrderDeleteArgs;
  };
  seller: {
    type: T.Seller;
    query: T.Prisma.SellerFindManyArgs;
    create: T.Prisma.SellerCreateArgs;
    update: T.Prisma.SellerUpdateArgs;
    delete: T.Prisma.SellerDeleteArgs;
  };
  client: {
    type: T.Client;
    query: T.Prisma.ClientFindManyArgs;
    create: T.Prisma.ClientCreateArgs;
    update: T.Prisma.ClientUpdateArgs;
    delete: T.Prisma.ClientDeleteArgs;
  };
  review: {
    type: T.Review;
    query: T.Prisma.ReviewFindManyArgs;
    create: T.Prisma.ReviewCreateArgs;
    update: T.Prisma.ReviewUpdateArgs;
    delete: T.Prisma.ReviewDeleteArgs;
  };
  wishlist: {
    type: T.Wishlist;
    query: T.Prisma.WishlistFindManyArgs;
    create: T.Prisma.WishlistCreateArgs;
    update: T.Prisma.WishlistUpdateArgs;
    delete: T.Prisma.WishlistDeleteArgs;
  };
  post: {
    type: T.Post;
    query: T.Prisma.PostFindManyArgs;
    create: T.Prisma.PostCreateArgs;
    update: T.Prisma.PostUpdateArgs;
    delete: T.Prisma.PostDeleteArgs;
  };
  comment: {
    type: T.Comment;
    query: T.Prisma.CommentFindManyArgs;
    create: T.Prisma.CommentCreateArgs;
    update: T.Prisma.CommentUpdateArgs;
    delete: T.Prisma.CommentDeleteArgs;
  };
};

const api = {
  query: async <T extends keyof API>(resource: T, query?: API[T]["query"]) => {
    return request<API[T]["type"][]>(`/admin/${resource}`, {
      method: "QUERY",
      body: JSON.stringify(query || {}),
    });
  },
  create: async <T extends keyof API>(
    resource: T,
    input?: API[T]["create"]
  ) => {
    return request<API[T]["type"][]>(`/admin/${resource}`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  update: async <T extends keyof API>(
    resource: T,
    input?: API[T]["update"]
  ) => {
    return request<API[T]["type"][]>(`/admin/${resource}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },
  delete: async <T extends keyof API>(
    resource: T,
    input?: API[T]["delete"]
  ) => {
    return request<API[T]["type"][]>(`/admin/${resource}`, {
      method: "DELETE",
      body: JSON.stringify(input),
    });
  },
};

export default api;
