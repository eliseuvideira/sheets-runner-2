import { endpoint } from "@ev-fns/endpoint";

export const twitterLikes = endpoint(async (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});
