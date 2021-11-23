import { endpoint } from "@ev-fns/endpoint";

export const twitterMentions = endpoint(async (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});
