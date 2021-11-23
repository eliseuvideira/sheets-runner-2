import { sheets_v4 } from "googleapis";

export const sheetsWriteRetweets = async (
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  row_number: number,
  retweets: number,
) => {
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `G${row_number}:G${row_number}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[retweets]],
    },
  });
};
