import { endpoint } from "@ev-fns/endpoint";
import { createReadStream } from "fs";
import { join } from "path";

export const backup = endpoint(async (req, res) => {
  const stream = createReadStream(
    join(__dirname, "..", "..", "database", "database", "database.sqlite3"),
  );

  stream.pipe(
    res
      .status(200)
      .header("Content-Disposition", 'attachment; filename="database.sqlite3"')
      .contentType("application/x-sqlite3"),
  );
});
