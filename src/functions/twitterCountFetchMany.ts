import fetch from "node-fetch";

export interface TwitterCountFetchManyTweet {
  _id: string;
  tweet_id: string;
  username: string;
}

export interface TwitterCountFetchManyTweetCounted {
  _id: string;
  tweet_id: string;
  username: string;
  likes: number;
  retweets: number;
  replies: number;
}

export const twitterCountFetchMany = async (
  tweets: TwitterCountFetchManyTweet[],
) => {
  if (!tweets.length) {
    return [];
  }

  const url = new URL(process.env.TWITTER_COUNT_API_URL);

  url.pathname = "/tweets";

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.TWITTER_COUNT_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tweets: tweets.map(({ _id, tweet_id, username }) => ({
        _id,
        tweet_id,
        username,
      })),
    }),
  });

  if (response.status !== 200) {
    const error = await response.json();

    throw new Error(
      `failed to fetch ${response.url} with status ${
        response.status
      }\n${JSON.stringify(error, null, 2)}`,
    );
  }

  const items: TwitterCountFetchManyTweetCounted[] = await response.json();

  return items;
};
