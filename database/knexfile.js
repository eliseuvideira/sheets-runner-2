const { dotenv } = require("@ev-fns/dotenv");
const { join } = require("path");

dotenv({
  path: join(__dirname, "..", ".env"),
  example: join(__dirname, "..", ".env.example"),
});

module.exports = {
  client: "sqlite3",
  connection: {
    filename: join(__dirname, "database", "database.sqlite3"),
  },
  migrations: {
    stub: "stub.js",
  },
  useNullAsDefault: true,
};
