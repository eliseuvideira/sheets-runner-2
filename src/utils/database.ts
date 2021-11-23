import knex from "knex";
import { join } from "path";

const MIGRATIONS_PATH = join(__dirname, "..", "..", "database", "migrations");

const MIN_POOL = 2;

const MAX_POOL = 20;

export const database = knex({
  client: "sqlite3",
  connection: {
    filename: join(
      __dirname,
      "..",
      "..",
      "database",
      "database",
      "database.sqlite3",
    ),
  },
  migrations: {
    directory: MIGRATIONS_PATH,
  },
  useNullAsDefault: true,
  pool: {
    min: MIN_POOL,
    max: MAX_POOL,
  },
});
