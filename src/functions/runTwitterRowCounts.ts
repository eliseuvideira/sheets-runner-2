import { Row } from "../models/Row";
import { Run } from "../models/Run";
import { TwitterCounts } from "../models/TwitterCounts";
import { database } from "../utils/database";
import { sheets } from "../utils/sheets";
import { sheetsWriteCount } from "./sheetsWriteCount";
import { TwitterCountFetchManyTweetCounted } from "./twitterCountFetchMany";

export const runTwitterRowsCounts = async (
  tweets: TwitterCountFetchManyTweetCounted[],
  rows: Row[],
): Promise<Run> => {
  const started_at = new Date();

  const writtenRows: TwitterCounts[] = [];

  const tweetsMap = new Map(tweets.map((tweet) => [tweet._id, tweet]));

  try {
    for (const row of rows) {
      const counts = tweetsMap.get("row-number-" + row.row_number);

      if (!counts) {
        continue;
      }

      const values = {
        likes: counts.likes,
        tweet_likes: counts.likes,
        retweets: counts.retweets,
        tweet_retweets: counts.retweets,
        replies: counts.replies,
        tweet_replies: counts.replies,
      };

      await database.transaction(async (database) => {
        console.info(`row_number ${row.row_number}: updating twitter counts`);

        await database
          .from("spreadsheet_rows")
          .where({ row_number: row.row_number })
          .update({ ...values });

        await sheetsWriteCount(
          sheets,
          process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
          row.row_number,
          counts,
        );
      });

      writtenRows.push({
        row_number: row.row_number,
        tweet_id: row.tweet_id,
        ...values,
      });
    }
  } catch (err: any) {
    if (writtenRows.length) {
      console.error(err);

      return {
        started_at,
        successful: false,
        error: { message: err.message },
        items: writtenRows,
      };
    }

    throw err;
  }

  return { started_at, successful: true, items: writtenRows };
};
