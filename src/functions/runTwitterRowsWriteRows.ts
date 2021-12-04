import { Row } from "../models/Row";
import { Run } from "../models/Run";
import { sheets } from "../utils/sheets";
import { sheetsWriteRow } from "./sheetsWriteRow";

export const runTwitterRowsWriteRows = async (rows: Row[]): Promise<Run> => {
  const started_at = new Date();

  const writtenRows: Row[] = [];

  try {
    for (const row of rows) {
      console.info(`row_number ${row.row_number}: rewritting values`);

      await sheetsWriteRow(
        sheets,
        process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
        row,
      );

      writtenRows.push(row);
    }
  } catch (err: any) {
    if (writtenRows.length) {
      console.error(err);

      return {
        started_at,
        successful: false,
        error: { message: err.message },
        items: writtenRows,
      };
    }

    throw err;
  }

  return { started_at, successful: true, items: writtenRows };
};
