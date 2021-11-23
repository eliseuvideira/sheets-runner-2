import { endpoint } from "@ev-fns/endpoint";
import { sheetsWriteRetweets } from "../functions/sheetsWriteRetweets";
import { twitterGetRetweets } from "../functions/twitterGetRetweets";
import { SpreadsheetRow } from "../models/SpreadsheetRow";
import { database } from "../utils/database";
import { sheets } from "../utils/sheets";

type TwitterRetweet = Pick<
  SpreadsheetRow,
  "row_number" | "tweet_id" | "retweets" | "tweet_retweets"
>;

export const twitterRetweets = endpoint(async (req, res) => {
  const missingLikesRows: SpreadsheetRow[] = await database
    .from("spreadsheet_rows")
    .where({ plataform: "twitter" })
    .whereNull("retweets")
    .orderBy("row_number", "asc");

  const rows: TwitterRetweet[] = [];

  for (const missingLike of missingLikesRows) {
    const retweets = await twitterGetRetweets(missingLike.tweet_id);

    await database.transaction(async (database) => {
      await database
        .from("spreadsheet_rows")
        .where({ row_number: missingLike.row_number })
        .update({ retweets, tweet_retweets: retweets });

      await sheetsWriteRetweets(
        sheets,
        process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
        missingLike.row_number,
        retweets,
      );
    });

    rows.push({
      row_number: missingLike.row_number,
      tweet_id: missingLike.tweet_id,
      retweets,
      tweet_retweets: retweets,
    });
  }

  res.status(200).json(rows);
});
