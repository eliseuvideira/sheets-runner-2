import { endpoint } from "@ev-fns/endpoint";
import { HttpError } from "@ev-fns/errors";
import { database } from "../utils/database";

export const spreadsheetRowsGetMany = endpoint(async (req, res) => {
  const rows = await database.from("spreadsheet_rows");

  res.status(200).json(rows);
});

export const spreadsheetRowsSequenceGetOne = endpoint(async (req, res) => {
  const sequence = await database.from("spreadsheet_rows_sequence").first();

  if (!sequence) {
    throw new HttpError(425, "No rows written yet");
  }

  res.status(200).json({ sequence: sequence.sequence });
});

export const spreadsheetRowsGetOne = endpoint(async (req, res) => {
  const { row_number } = req.params as unknown as Record<string, number>;

  const row = await database
    .from("spreadsheet_rows")
    .where({ row_number })
    .first();

  if (!row) {
    throw new HttpError(404, "Not found");
  }

  res.status(200).json(row);
});
