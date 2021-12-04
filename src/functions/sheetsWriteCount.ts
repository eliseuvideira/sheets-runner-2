import { sheets_v4 } from "googleapis";

export interface SheetsWriteCountProps {
  likes: number;
  retweets: number;
  replies: number;
}

export const sheetsWriteCount = async (
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  row_number: number,
  { likes, retweets, replies }: SheetsWriteCountProps,
) => {
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `F${row_number}:H${row_number}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[likes, retweets, replies]],
    },
  });
};
