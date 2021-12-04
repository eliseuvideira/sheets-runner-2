import { endpoint } from "@ev-fns/endpoint";
import { sheetsWriteCount } from "../functions/sheetsWriteCount";
import { twitterCountFetchMany } from "../functions/twitterCountFetchMany";
import { SpreadsheetRow } from "../models/SpreadsheetRow";
import { database } from "../utils/database";
import { sheets } from "../utils/sheets";

export type TwitterCount = Pick<
  SpreadsheetRow,
  | "row_number"
  | "tweet_id"
  | "likes"
  | "tweet_likes"
  | "retweets"
  | "tweet_retweets"
  | "replies"
  | "tweet_replies"
>;

export const twitterCount = endpoint(async (req, res) => {
  const missingCountRows: SpreadsheetRow[] = await database
    .from("spreadsheet_rows")
    .where({ plataform: "twitter" })
    .where((builder) => {
      builder.orWhereNull("likes");
      builder.orWhereNull("retweets");
      builder.orWhereNull("replies");
    })
    .orderBy("row_number", "asc");

  const rows: TwitterCount[] = [];

  const tweets = await twitterCountFetchMany(
    missingCountRows.map((missingCount) => ({
      _id: "row-number-" + missingCount.row_number,
      tweet_id: missingCount.tweet_id,
      username: missingCount.tweet_author_username,
    })),
  );

  const tweetsMap = new Map(tweets.map((tweet) => [tweet._id, tweet]));

  try {
    for (const missingCount of missingCountRows) {
      const counts = tweetsMap.get("row-number-" + missingCount.row_number);

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
        await database
          .from("spreadsheet_rows")
          .where({ row_number: missingCount.row_number })
          .update({ ...values });

        await sheetsWriteCount(
          sheets,
          process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
          missingCount.row_number,
          counts,
        );
      });

      rows.push({
        row_number: missingCount.row_number,
        tweet_id: missingCount.tweet_id,
        ...values,
      });
    }
  } catch (err: any) {
    if (rows.length) {
      console.error(err);

      res.status(200).json({
        successful: false,
        error: { message: err.message },
        items: rows,
      });

      return;
    }
    throw err;
  }

  res.status(200).json({ successful: true, items: rows });
});
