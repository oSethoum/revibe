import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import * as jwt from "@/lib/jwt";

export const maybeAuthenticated: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, "token");
  if (!token) {
    return next();
  }

  const payload = await jwt.verify(token);
  c.set("jwtPayload", payload);
  return next();
};

export const isAuthenticated: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, "token");
  if (!token) {
    return c.json(
      {
        ok: false,
        message: "Unauthorized",
      },
      401
    );
  }

  const payload = await jwt.verify(token);
  c.set("jwtPayload", payload);
  return next();
};

export const isAdmin: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, "token");
  if (!token) {
    return c.json(
      {
        ok: false,
        message: "Unauthorized",
      },
      401
    );
  }

  const payload = await jwt.verify(token);

  if (payload.role != "ADMIN") {
    return c.json(
      {
        ok: false,
        message: "Unauthorized",
      },
      401
    );
  }
  c.set("jwtPayload", payload);
  return next();
};

export const isClient: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, "token");
  if (!token) {
    return c.json(
      {
        ok: false,
        message: "Unauthorized",
      },
      401
    );
  }

  const payload = await jwt.verify(token);

  if (payload.role != "CLIENT") {
    return c.json(
      {
        ok: false,
        message: "Unauthorized",
      },
      401
    );
  }
  c.set("jwtPayload", payload);
  return next();
};

export const isSeller: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, "token");
  if (!token) {
    return c.json(
      {
        ok: false,
        message: "Unauthorized",
      },
      401
    );
  }

  const payload = await jwt.verify(token);

  if (payload.role != "SELLER") {
    return c.json(
      {
        ok: false,
        message: "Unauthorized",
      },
      401
    );
  }
  c.set("jwtPayload", payload);
  return next();
};
