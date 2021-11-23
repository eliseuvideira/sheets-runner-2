import fetch from "node-fetch";

export const twitterGetRetweets = async (tweet_id: string) => {
  const url = `https://api.twitter.com/2/tweets/${tweet_id}/retweeted_by`;

  console.info(`fetching ${url} for retweets...`);

  const response = await fetch(
    `https://api.twitter.com/2/tweets/${tweet_id}/retweeted_by`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    },
  );

  if (response.status !== 200) {
    const text = await response.text();

    throw new Error(
      `failed to fetch ${response.url} with status ${response.status}\n${text}`,
    );
  }

  const data = await response.json();

  if (data.errors) {
    return 0;
  }

  console.info(`${data.meta.result_count} retweets found`);

  return data.meta.result_count;
};
