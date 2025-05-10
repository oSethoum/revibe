import { prisma } from "@/lib/prisma";
import { isAdmin, isClient } from "@/middlewares/auth.middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const client = new Hono();

client.use("/client/*", isClient);

client.post(
  "/post",
  zValidator(
    "json",
    z.object({
      title: z.string(),
      description: z.optional(z.string()),
      images: z.optional(z.array(z.string())),
    })
  ),

  (c) => {
    try {
      const body = c.req.valid("json");
      const payload = c.get("jwtPayload");
      prisma.post.create({
        data: {
          title: body.title,
          description: body.description,
          images: body.images,
          client: {
            connect: {
              id: payload.clientId,
            },
          },
        },
      });
    } catch (error) {}
    return c.text("Hello Hono!");
  }
);

export default client;
