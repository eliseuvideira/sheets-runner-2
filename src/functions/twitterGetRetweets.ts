import fetch from "node-fetch";

export const twitterGetRetweets = async (tweet_id: string) => {
  const url = `https://api.twitter.com/2/tweets/${tweet_id}/retweeted_by`;

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

  console.info(`${url} ${data.meta.result_count} retweets`);

  return data.meta.result_count;
};
