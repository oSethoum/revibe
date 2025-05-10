import * as jwt from "hono/jwt";

type JWTPayload = {
  id: string;
  clientId?: string;
  sellerId?: string;
  role: "ADMIN" | "CLIENT" | "SELLER";
  email: string;
  exp: number;
};

export const sign = (payload: JWTPayload) => {
  return jwt.sign(payload, "secret");
};

export const verify = (token: string) => {
  return jwt.verify(token, "secret") as Promise<JWTPayload>;
};
