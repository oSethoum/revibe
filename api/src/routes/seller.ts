import { Hono } from "hono";

const seller = new Hono();

seller.post("/product", async (c) => {});

export default seller;
