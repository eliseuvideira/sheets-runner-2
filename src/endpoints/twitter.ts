import { endpoint } from "@ev-fns/endpoint";
import { format } from "date-fns";
import { getNextRowNumber } from "../functions/getNextRowNumber";
import { sheetsWriteCount } from "../functions/sheetsWriteCount";
import { sheetsWriteRow } from "../functions/sheetsWriteRow";
import { twitterCountFetchMany } from "../functions/twitterCountFetchMany";
import { twitterGetMentions } from "../functions/twitterGetMentions";
import { Row } from "../models/Row";
import { database } from "../utils/database";
import { sheets } from "../utils/sheets";
import { twitterUser } from "../utils/twitterUser";

export type TwitterCount = Pick<
  Row,
  | "row_number"
  | "tweet_id"
  | "likes"
  | "tweet_likes"
  | "retweets"
  | "tweet_retweets"
  | "replies"
  | "tweet_replies"
>;

export const twitterRows = endpoint(async (req, res) => {
  const { start_date: startDate, end_date: endDate } =
    req.query as unknown as Record<string, Date>;

  const tweets = await twitterGetMentions(twitterUser.getUserId(), {
    startDate,
    endDate,
  });

  const rows: Row[] = [];

  try {
    for (const tweet of tweets) {
      const alreadyExists = await database
        .from("spreadsheet_rows")
        .where({ tweet_id: tweet.id })
        .first();

      if (alreadyExists) {
        console.info(
          `skipping tweet_id ${tweet.id}, already inserted before at row_number ${alreadyExists.row_number}`,
        );

        continue;
      }

      await database.transaction(async (database) => {
        const row_number = await getNextRowNumber(database);

        console.info(
          `inserting tweet_id ${tweet.id} at row_number ${row_number}`,
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

        rows.push(row);
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

export const twitterRowsCounts = endpoint(async (req, res) => {
  const missingCountRows: Row[] = await database
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