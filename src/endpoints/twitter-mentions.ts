import { endpoint } from "@ev-fns/endpoint";
import { format } from "date-fns";
import { getNextRowNumber } from "../functions/getNextRowNumber";
import { twitterGetMentions } from "../functions/twitterGetMentions";
import { database } from "../utils/database";
import { twitterUser } from "../utils/twitterUser";

export const twitterMentions = endpoint(async (req, res) => {
  const { start_date: startDate, end_date: endDate } =
    req.query as unknown as Record<string, Date>;

  const tweets = await twitterGetMentions(twitterUser.getUserId(), {
    startDate,
    endDate,
  });

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

      const row = {
        row_number,
        event_date: format(new Date(tweet.created_at), "M/dd"),
        link_url: `https://twitter.com/${tweet.author_username}/status/${tweet.id}`,
        plataform: "Twitter - mentions",
        issues_details: "See notes",
        issues_details_notes: tweet.text,
        likes: null,
        retweets: null,
        mentions: null,
        user: `${tweet.author_name} (@${tweet.author_username})`,
        tweet_id: tweet.id,
        tweet_content: tweet.text,
        tweet_created_at: tweet.created_at,
        tweet_author_id: tweet.author_id,
        tweet_author_username: tweet.author_username,
        tweet_author_name: tweet.author_name,
        tweet_likes: null,
        tweet_retweets: null,
      };

      await database.from("spreadsheet_rows").insert(row);
    });
  }

  res.status(200).json(tweets);
});
