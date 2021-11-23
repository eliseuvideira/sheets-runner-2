import { dotenv } from "@ev-fns/dotenv";

dotenv();

import server from "@ev-fns/server";
import app from "./app";
import { twitterGetUserId } from "./functions/twitterGetUserId";
import { database } from "./utils/database";
import { twitterUser } from "./utils/twitterUser";

const PORT = +process.env.PORT || 3000;

server({
  app,
  port: PORT,
  before: async () => {
    await database.migrate.latest();
    await database.raw(`select 1 as server_status`);

    const userId = await twitterGetUserId(process.env.TWITTER_USERNAME);
    if (!userId) {
      throw new Error(
        `failed to get user id for ${process.env.TWITTER_USERNAME} with userId ${userId}`,
      );
    }

    twitterUser.setUserId(userId);
  },
  after: async () => {
    console.info(`🚀 http://localhost:${PORT}`);
  },
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
