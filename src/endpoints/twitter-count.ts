import { endpoint } from "@ev-fns/endpoint";

export const twitterCount = endpoint(async (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});
