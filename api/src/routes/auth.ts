import { Hono } from "hono";
import { setCookie, getCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const authRoutes = new Hono();

authRoutes.post(
  "/login",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  ),
  async (c) => {
    const body = c.req.valid("json");

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return c.json(
        {
          ok: false,
          message: "User not found",
        },
        400
      );
    }

    if (await Bun.password.verify(body.password, user.password)) {
      return c.json({
        ok: false,
        message: "Invalid credentials",
      });
    }

    const token = await sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      "secret"
    );

    setCookie(c, "token", token, {
      httpOnly: true,
      domain: ".localhost",
      maxAge: 60 * 60,
    });

    return c.json({
      token,
      ok: true,
    });
  }
);

authRoutes.post(
  "/register",
  zValidator(
    "json",
    z.object({
      name: z.string(),
      email: z.string().email(),
      shopName: z.optional(z.string().min(4)),
      role: z.enum(["CLIENT", "SELLER"]),
      password: z.string(),
    })
  ),
  async (c) => {
    const body = c.req.valid("json");
    const hash = await Bun.password.hash(body.password);

    if (body.role == "SELLER" && !body.shopName) {
      return c.json({
        ok: false,
      });
    }

    try {
      await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hash,
          role: body.role,
          client:
            body.role == "CLIENT"
              ? {
                  create: {},
                }
              : undefined,
          seller:
            body.role == "SELLER"
              ? {
                  create: {
                    shop: body.shopName!,
                  },
                }
              : undefined,
        },
      });

      return c.redirect("http://localhost:3000/auth/login?register=success");
    } catch (error: any) {
      return c.json(
        {
          of: false,
          error: error.message,
        },
        400
      );
    }
  }
);

authRoutes.post("/logout", async (c) => {
  setCookie(c, "token", "", {
    httpOnly: true,
    domain: ".localhost",
    maxAge: 0,
  });
});

authRoutes.post("/refresh", async (c) => {
  const clearToken = () => {
    setCookie(c, "token", "", {
      httpOnly: true,
      domain: ".localhost",
      maxAge: 0,
    });
  };

  const tokenString = getCookie(c, "token");

  if (!tokenString) {
    clearToken();
    return c.redirect("http://localhost:3000/auth/login");
  } else {
    const oldToken = await verify(tokenString, "secret");
    if (!oldToken) {
      clearToken();
      return c.redirect("http://localhost:3000/auth/login");
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: oldToken.id as string,
        },
      });

      if (user == null) {
        clearToken();
        return c.redirect("http://localhost:3000/auth/login");
      }

      const token = await sign(
        {
          id: user.id,
          role: user.role,
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        "secret"
      );

      setCookie(c, "token", token, {
        httpOnly: true,
        domain: ".localhost",
        maxAge: 60 * 60,
      });

      return c.json({
        ok: true,
        token,
      });
    } catch (error) {
      clearToken();
      return c.redirect("http://localhost:3000/auth/login");
    }
  }
});

export default authRoutes;
