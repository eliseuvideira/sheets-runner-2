import { format } from "date-fns";
import { Row } from "../models/Row";
import { Run } from "../models/Run";
import { database } from "../utils/database";
import { sheets } from "../utils/sheets";
import { getNextRowNumber } from "./getNextRowNumber";
import { sheetsWriteRow } from "./sheetsWriteRow";
import { Tweet } from "./twitterGetMentions";

export const runTwitterRows = async (tweets: Tweet[]): Promise<Run> => {
  const started_at = new Date();

  const writtenRows: Row[] = [];

  try {
    for (const tweet of tweets) {
      const alreadyExists = await database
        .from("spreadsheet_rows")
        .where({ tweet_id: tweet.id })
        .first();

      if (alreadyExists) {
        console.info(
          `tweet_id ${tweet.id}: skipping, already inserted before at row_number ${alreadyExists.row_number}`,
        );

        continue;
      }

      await database.transaction(async (database) => {
        const row_number = await getNextRowNumber(database);

        console.info(
          `tweet_id ${tweet.id}: inserting at row_number ${row_number}`,
        );

        const row: Row = {
          row_number,
          event_date: format(new Date(tweet.created_at), "M/dd"),
          link_url: `https://twitter.com/${tweet.author_username}/status/${tweet.id}`,
          plataform: "twitter",
          issues_details: "See notes",
          issues_details_notes: tweet.text,
          likes: null,
          retweets: null,
          replies: null,
          user: `${tweet.author_name} (@${tweet.author_username})`,
          tweet_id: tweet.id,
          tweet_content: tweet.text,
          tweet_created_at: tweet.created_at,
          tweet_author_id: tweet.author_id,
          tweet_author_username: tweet.author_username,
          tweet_author_name: tweet.author_name,
          tweet_likes: null,
          tweet_retweets: null,
          tweet_replies: null,
          created_at: new Date(),
        };

        await database.from("spreadsheet_rows").insert(row);

        await sheetsWriteRow(
          sheets,
          process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
          row,
        );

        writtenRows.push(row);
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
