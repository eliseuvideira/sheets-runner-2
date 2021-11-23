import fetch from "node-fetch";

export const twitterGetLikes = async (tweet_id: string) => {
  const url = `https://api.twitter.com/2/tweets/${tweet_id}/liking_users`;

  console.info(`fetching ${url} for likes...`);

  const response = await fetch(
    `https://api.twitter.com/2/tweets/${tweet_id}/liking_users`,
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

  console.info(`${data.meta.result_count} likes found`);

  return data.meta.result_count;
};
