import { Row } from "./Row";

export type TwitterCounts = Pick<
  Row,
  | "row_number"
  | "tweet_id"
  | "likes"
  | "tweet_likes"
  | "retweets"
  | "tweet_retweets"
  | "replies"
  | "tweet_replies"
>;
