import { endpoint } from "@ev-fns/endpoint";
import { Parser } from "json2csv";
import { Readable } from "stream";
import { Row } from "../models/Row";
import { database } from "../utils/database";

export const dumpCsv = endpoint(async (req, res) => {
  const fields = [
    { label: "Incident Date", value: "incident_date" },
    { label: "Link", value: "link" },
    { label: "Platform", value: "plataform" },
    { label: "Support Need", value: "support_need" },
    { label: "Issue / details", value: "issue_details" },
    { label: "Likes", value: "likes" },
    { label: "Retweets", value: "retweets" },
    { label: "Mentions", value: "replies" },
    { label: "Support/Feed?", value: "support_feed" },
    { label: "User", value: "user" },
    { label: "Solution / Notes", value: "solution_note" },
    { label: "Status", value: "status" },
    { label: "Escalated to", value: "escalated_to" },
    { label: "Assisted by", value: "assisted_by" },
    { label: "Follow up?", value: "follow_up" },
    { label: "Escalated to?", value: "escalated_to_question" },
    { label: "## Row Number ##", value: "row_number" },
    { label: "## Notes ##", value: "notes" },
    { label: "## Author Username ##", value: "author_username" },
    { label: "## Author Name ##", value: "author_name" },
  ];

  const parser = new Parser({ fields });

  const rows: Row[] = await database
    .from("spreadsheet_rows")
    .orderBy("row_number", "asc");

  const content = parser.parse(
    rows.map((row) => ({
      incident_date: row.event_date,
      link: row.link_url,
      plataform: row.plataform,
      support_need: "",
      issue_details: row.issues_details,
      likes: row.likes,
      retweets: row.retweets,
      replies: row.replies,
      support_feed: "",
      user: row.user,
      solution_note: "",
      status: "",
      escalated_to: "",
      assisted_by: "",
      follow_up: "",
      escalated_to_question: "",
      row_number: row.row_number,
      notes: row.tweet_content,
      author_username: row.tweet_author_username,
      author_name: row.tweet_author_name,
    })),
  );

  const stream = Readable.from(content);

  stream.pipe(
    res
      .header(
        "Content-Disposition",
        `attachment; filename="spreadsheet_rows.csv"`,
      )
      .contentType("text/csv")
      .status(200),
  );
});
