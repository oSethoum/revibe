import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient().$extends({
  query: {
    product: {
      findMany: ({ args, query }) => {
        return query({
          ...args,
          where: {
            ...args.where,
            deletedAt: null,
          },
        });
      },
    },
  },
});
