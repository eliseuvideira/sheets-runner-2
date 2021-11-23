import fetch from "node-fetch";

export const twitterGetUserId = async (username: string) => {
  const response = await fetch(
    `https://api.twitter.com/2/users/by/username/${username}`,
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
      `failed to fetch twitter user id, fetch failed for ${response.url} with status ${response.status}\n${text}`,
    );
  }

  const data = await response.json();

  return data.data.id;
};
