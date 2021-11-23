import { dotenv } from "@ev-fns/dotenv";

dotenv();

import server from "@ev-fns/server";
import app from "./app";
import { database } from "./utils/database";

const PORT = +process.env.PORT || 3000;

server({
  app,
  port: PORT,
  before: async () => {
    await database.migrate.latest();
    await database.raw(`select 1 as server_status`);
  },
  after: async () => {
    console.info(`🚀 http://localhost:${PORT}`);
  },
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
