import { sheets_v4 } from "googleapis";
import { Row } from "../models/Row";

export const sheetsWriteRow = async (
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  row: Row,
) => {
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `A${row.row_number}:C${row.row_number}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[row.event_date, row.link_url, row.plataform]],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `E${row.row_number}:H${row.row_number}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[row.issues_details, row.likes, row.retweets, row.replies]],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `J${row.row_number}:J${row.row_number}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[row.user]],
    },
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          updateCells: {
            fields: "note",
            range: {
              startRowIndex: row.row_number - 1,
              endRowIndex: row.row_number,
              startColumnIndex: 4,
              endColumnIndex: 5,
            },
            rows: [{ values: [{ note: row.issues_details_notes }] }],
          },
        },
      ],
    },
  });
};
