import { sheets_v4 } from "googleapis";

export const sheetsWriteLikes = async (
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  row_number: number,
  likes: number,
) => {
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `F${row_number}:F${row_number}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[likes]],
    },
  });
};
