export interface Row {
  row_number: number;
  event_date: string;
  link_url: string;
  plataform: "twitter";
  issues_details: string;
  issues_details_notes: string;
  likes: number | null;
  retweets: number | null;
  replies: number | null;
  user: string;
  tweet_id: string;
  tweet_content: string;
  tweet_created_at: Date;
  tweet_author_id: string;
  tweet_author_username: string;
  tweet_author_name: string;
  tweet_likes: number | null;
  tweet_retweets: number | null;
  tweet_replies: number | null;
  created_at: Date;
}
