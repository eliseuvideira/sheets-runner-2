import { endpoint } from "@ev-fns/endpoint";
import { twitterGetMentions } from "../functions/twitterGetMentions";
import { twitterUser } from "../utils/twitterUser";

export const twitterMentions = endpoint(async (req, res) => {
  const { start_date: startDate, end_date: endDate } =
    req.query as unknown as Record<string, Date>;

  const tweets = await twitterGetMentions(twitterUser.getUserId(), {
    startDate,
    endDate,
  });

  res.status(200).json(tweets);
});
