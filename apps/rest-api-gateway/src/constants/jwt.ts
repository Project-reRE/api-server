import * as process from "process";

export const jwtConstants = {
  secret: process.env.JWT_SECRET || "JWT_SECRET_KEY_EXAMPLE",
};
