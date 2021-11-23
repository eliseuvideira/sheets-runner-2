import { endpoint } from "@ev-fns/endpoint";
import { sheetsWriteLikes } from "../functions/sheetsWriteLikes";
import { twitterGetLikes } from "../functions/twitterGetLikes";
import { SpreadsheetRow } from "../models/SpreadsheetRow";
import { database } from "../utils/database";
import { sheets } from "../utils/sheets";

type TwitterLike = Pick<
  SpreadsheetRow,
  "row_number" | "tweet_id" | "likes" | "tweet_likes"
>;

export const twitterLikes = endpoint(async (req, res) => {
  const missingLikesRows: SpreadsheetRow[] = await database
    .from("spreadsheet_rows")
    .where({ plataform: "twitter" })
    .whereNull("likes")
    .orderBy("row_number", "asc");

  const rows: TwitterLike[] = [];

  try {
    for (const missingLike of missingLikesRows) {
      const likes = await twitterGetLikes(missingLike.tweet_id);

      await database.transaction(async (database) => {
        await database
          .from("spreadsheet_rows")
          .where({ row_number: missingLike.row_number })
          .update({ likes, tweet_likes: likes });

        await sheetsWriteLikes(
          sheets,
          process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
          missingLike.row_number,
          likes,
        );
      });

      rows.push({
        row_number: missingLike.row_number,
        tweet_id: missingLike.tweet_id,
        likes,
        tweet_likes: likes,
      });
    }
  } catch (err: any) {
    if (rows.length) {
      console.error(err);

      res.status(200).json({
        successful: false,
        items: rows,
        error: { message: err.message },
      });

      return;
    }
    throw err;
  }

  res.status(200).json({ successful: true, items: rows });
});
