import { Knex } from "knex";

export const getNextRowNumber = async (database: Knex) => {
  const sequence = await database
    .from("spreadsheet_rows_sequence")
    .where({ lock: "X" })
    .first();

  if (!sequence) {
    await database.from("spreadsheet_rows_sequence").insert({
      lock: "X",
      sequence: 2,
    });

    return 2;
  }

  await database
    .from("spreadsheet_rows_sequence")
    .update({
      sequence: sequence.sequence + 1,
    })
    .where({ lock: "X" });

  return (sequence.sequence + 1) as number;
};
