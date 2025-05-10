import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { seed } from "./lib/seed";

import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import publicRoutes from "./routes/public";
import clientRoutes from "./routes/client";
import sellerRoutes from "./routes/seller";

seed();

const app = new Hono().basePath("/api");

app.use(logger());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowMethods: ["QUERY", "GET", "POST", "PUT", "DELETE"],
  })
);

app.route("/", publicRoutes);
app.route("/auth", authRoutes);
app.route("/client", clientRoutes);
app.route("/seller", sellerRoutes);
app.route("/admin", adminRoutes);

export default {
  port: 5000,
  fetch: app.fetch,
};
