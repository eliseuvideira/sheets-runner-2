import { endpoint } from "@ev-fns/endpoint";
import { appendJobs } from "../functions/appendJobs";
import { nanoid } from "../functions/nanoid";
import { runJob } from "../functions/runJob";
import { runTwitterRowsCounts } from "../functions/runTwitterRowCounts";
import { runTwitterRows } from "../functions/runTwitterRows";
import { runTwitterRowsWriteRows } from "../functions/runTwitterRowsWriteRows";
import { sheetsWriteCount } from "../functions/sheetsWriteCount";
import { sheetsWriteRow } from "../functions/sheetsWriteRow";
import { twitterCountFetchMany } from "../functions/twitterCountFetchMany";
import { twitterGetMentions } from "../functions/twitterGetMentions";
import { Job } from "../models/Job";
import { Row } from "../models/Row";
import { TwitterCounts } from "../models/TwitterCounts";
import { database } from "../utils/database";
import { jobs } from "../utils/jobs";
import { sheets } from "../utils/sheets";
import { twitterUser } from "../utils/twitterUser";

export const twitterRows = endpoint(async (req, res) => {
  const { start_date: startDate, end_date: endDate } =
    req.query as unknown as Record<string, Date>;

  const tweets = await twitterGetMentions(twitterUser.getUserId(), {
    startDate,
    endDate,
  });

  const values = await runTwitterRows(tweets);

  res.status(200).json(values);
});

export const twitterRowsCounts = endpoint(async (req, res) => {
  const { row_numbers } = req.body as { row_numbers: number[] };

  const rows: Row[] = await database
    .from("spreadsheet_rows")
    .where({ plataform: "twitter" })
    .where((builder) => {
      if (row_numbers && row_numbers.length) {
        builder.whereIn("row_number", row_numbers);
      } else {
        builder.orWhereNull("likes");
        builder.orWhereNull("retweets");
        builder.orWhereNull("replies");
      }
    })
    .orderBy("row_number", "asc");

  const writtenRows: TwitterCounts[] = [];

  const tweets = await twitterCountFetchMany(
    rows.map((missingCount) => ({
      _id: "row-number-" + missingCount.row_number,
      tweet_id: missingCount.tweet_id,
      username: missingCount.tweet_author_username,
    })),
  );

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

      res.status(200).json({
        successful: false,
        error: { message: err.message },
        items: writtenRows,
      });

      return;
    }
    throw err;
  }

  res.status(200).json({ successful: true, items: writtenRows });
});

export const twitterRowsWriteRows = endpoint(async (req, res) => {
  const { row_numbers } = req.body as { row_numbers: number[] };

  const rows: Row[] = await database
    .from("spreadsheet_rows")
    .whereIn("row_number", row_numbers);

  const writtenRows: Row[] = [];

  try {
    for (const row of rows) {
      await sheetsWriteRow(
        sheets,
        process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
        row,
      );

      writtenRows.push(row);
    }
  } catch (err: any) {
    if (writtenRows.length) {
      console.error(err);

      res.status(200).json({
        successful: false,
        error: { message: err.message },
        items: writtenRows,
      });

      return;
    }

    throw err;
  }

  res.status(200).json({ successful: true, items: writtenRows });
});

export const twitterRowsAsync = endpoint(async (req, res) => {
  const { start_date: startDate, end_date: endDate } =
    req.query as unknown as Record<string, Date>;

  const tweets = await twitterGetMentions(twitterUser.getUserId(), {
    startDate,
    endDate,
  });

  const job_id = nanoid();

  const job: Job = {
    job_id,
    route: "/async/twitter",
    completed: false,
    successful: false,
    attempts: 0,
    runs: [],
    fatal_errors: [],
  };

  appendJobs(jobs, job);

  res.status(200).json(job);

  let pendingTweets = [...tweets];

  await runJob(job, async () => {
    const run = await runTwitterRows(pendingTweets);

    if (run.items) {
      const tweet_ids = run.items.map((item) => item.tweet_id);

      pendingTweets = pendingTweets.filter(
        (tweet) => !tweet_ids.includes(tweet.id),
      );
    }

    return run;
  });
});

export const twitterRowsCountsAsync = endpoint(async (req, res) => {
  const { row_numbers } = req.body as { row_numbers: number[] };

  const rows: Row[] = await database
    .from("spreadsheet_rows")
    .where({ plataform: "twitter" })
    .where((builder) => {
      if (row_numbers && row_numbers.length) {
        builder.whereIn("row_number", row_numbers);
      } else {
        builder.orWhereNull("likes");
        builder.orWhereNull("retweets");
        builder.orWhereNull("replies");
      }
    })
    .orderBy("row_number", "asc");

  const tweets = await twitterCountFetchMany(
    rows.map((row) => ({
      _id: "row-number-" + row.row_number,
      tweet_id: row.tweet_id,
      username: row.tweet_author_username,
    })),
  );

  const job_id = nanoid();

  const job: Job = {
    job_id,
    route: "/async/twitter/counts",
    completed: false,
    successful: false,
    attempts: 0,
    runs: [],
    fatal_errors: [],
  };

  appendJobs(jobs, job);

  res.status(200).json(job);

  let pendingRows = [...rows];

  await runJob(job, async () => {
    const run = await runTwitterRowsCounts(tweets, pendingRows);

    if (run.items) {
      const row_numbers = run.items.map((item) => item.row_number);

      pendingRows = pendingRows.filter(
        (row) => !row_numbers.includes(row.row_number),
      );
    }

    return run;
  });
});

export const twitterRowsWriteRowsAsync = endpoint(async (req, res) => {
  const { row_numbers } = req.body as { row_numbers: number[] };

  const rows: Row[] = await database
    .from("spreadsheet_rows")
    .whereIn("row_number", row_numbers);

  const job_id = nanoid();

  const job: Job = {
    job_id,
    route: "/async/twitter/write-rows",
    completed: false,
    successful: false,
    attempts: 0,
    runs: [],
    fatal_errors: [],
  };

  appendJobs(jobs, job);

  res.status(200).json(job);

  let pendingRows = [...rows];

  await runJob(job, async () => {
    const run = await runTwitterRowsWriteRows(pendingRows);

    if (run.items) {
      const row_numbers = run.items.map((item) => item.row_number);

      pendingRows = pendingRows.filter(
        (row) => !row_numbers.includes(row.row_number),
      );
    }

    return run;
  });
});
