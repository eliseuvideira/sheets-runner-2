import { addMinutes, endOfDay, startOfDay } from "date-fns";
import fetch from "node-fetch";

export interface Tweet {
  id: string;
  text: string;
  created_at: Date;
  author_username: string;
  author_name: string;
}

export interface TwitterGetMentionsProps {
  startDate: Date;
  endDate: Date;
}

const TIMEZONE_OFFSET = new Date().getTimezoneOffset();

const parseDate = (date: Date) => date.toISOString().replace(/\.\d{3}Z$/, "Z");

export const twitterGetMentions = async (
  userId: string,
  { startDate, endDate }: TwitterGetMentionsProps,
  pagination_token: string | null = null,
): Promise<Tweet[]> => {
  const url = new URL("https://api.twitter.com");

  url.pathname = `/2/users/${userId}/mentions`;

  url.searchParams.append("expansions", "author_id");
  url.searchParams.append("tweet.fields", "author_id,created_at");

  const start_time = startOfDay(addMinutes(startDate, TIMEZONE_OFFSET));
  const end_time = endOfDay(addMinutes(endDate, TIMEZONE_OFFSET));

  url.searchParams.append("start_time", parseDate(start_time));
  url.searchParams.append("end_time", parseDate(end_time));

  if (pagination_token) {
    url.searchParams.append("pagination_token", pagination_token);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  });

  if (response.status !== 200) {
    const text = await response.text();

    throw new Error(
      `failed to fetch twitter mentions for user ${userId}, fetch failed for ${response.url} with status ${response.status}\n${text}`,
    );
  }

  const data = await response.json();

  const meta = data.meta;

  if (!meta.result_count) {
    return [];
  }

  const users = new Map<string, any>(
    data.includes.users.map((user: any) => [user.id, user]),
  );

  const tweets: Tweet[] = [];

  for (const tweet of data.data) {
    const user = users.get(tweet.author_id);

    tweets.push({
      id: tweet.id,
      text: tweet.text,
      created_at: tweet.created_at,
      author_username: user.username,
      author_name: user.name,
    });
  }

  if (meta.next_token) {
    const next_tweets = await twitterGetMentions(
      userId,
      { startDate, endDate },
      meta.next_token,
    );

    tweets.push(...next_tweets);
  }

  return tweets;
};
