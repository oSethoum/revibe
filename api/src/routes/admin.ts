import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/middlewares/auth.middleware";

const adminRoutes = new Hono();

const validateResource = (resource: string) => {
  if (
    ![
      "user",
      "product",
      "category",
      "order",
      "client",
      "seller",
      "review",
      "wishlist",
      "post",
      "orderItem",
      "comment",
    ].includes(resource)
  ) {
    throw new Error("invalid resource");
  }
};

// adminRoutes.use(isAdmin);

adminRoutes.on("QUERY", "/:resource", async (c) => {
  const body = await c.req.json();
  const resource: any = c.req.param("resource");
  try {
    validateResource(resource);
    // @ts-ignore
    const data = await prisma[resource].findMany(body);
    return c.json({
      ok: true,
      data,
    });
  } catch (error: any) {
    return c.json(
      {
        ok: false,
        error: error.message,
      },
      400
    );
  }
});

adminRoutes.post("/:resource", async (c) => {
  const body = await c.req.json();
  const resource: any = c.req.param("resource");
  try {
    validateResource(resource);
    // @ts-ignore
    const data = await prisma[resource].create(body);
    return c.json({
      ok: true,
      data,
    });
  } catch (error: any) {
    return c.json(
      {
        ok: false,
        error: error.message,
      },
      400
    );
  }
});

adminRoutes.put("/:resource", async (c) => {
  const body = await c.req.json();
  const resource: any = c.req.param("resource");
  try {
    validateResource(resource);
    // @ts-ignore
    const data = await prisma[resource].update(body);
    return c.json({
      ok: true,
      data,
    });
  } catch (error: any) {
    return c.json(
      {
        ok: false,
        error: error.message,
      },
      400
    );
  }
});

adminRoutes.delete("/:resource", async (c) => {
  const body = await c.req.json();
  const resource: any = c.req.param("resource");
  try {
    validateResource(resource);
    // @ts-ignore
    const data = await prisma[resource].delete(body);
    return c.json({
      ok: true,
      data,
    });
  } catch (error: any) {
    return c.json(
      {
        ok: false,
        error: error.message,
      },
      400
    );
  }
});

export default adminRoutes;
