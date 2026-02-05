import { drizzle } from "drizzle-orm/d1";

export const getDb = (d1Database: D1Database) => {
  return drizzle(d1Database);
};
