import { prisma } from "@/lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const publicRouter = new Hono();

publicRouter.get("/categories", async (c) => {
  const categories = await prisma.category.findMany();

  return c.json({
    ok: true,
    data: categories,
  });
});

publicRouter.get(
  "/products",
  zValidator(
    "query",
    z.object({
      category: z.string().optional(),
      search: z.string().optional(),
      page: z.number().optional().default(1),
      take: z.number().optional().default(10),
    })
  ),
  async (c) => {
    const { page = 1, search, category } = c.req.valid("query");
    const count = await prisma.product.count({
      where: {
        category: {
          name: category,
        },
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      },
    });

    const products = await prisma.product.findMany({
      take: 10,
      skip: (page - 1) * 10,
      include: {},
      where: {
        category: {
          name: category,
        },
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      },
    });

    return c.json({
      ok: true,
      count,
      data: products,
    });
  }
);

publicRouter.post("/order", zValidator("json", z.object({})), async (c) => {});

export default publicRouter;
