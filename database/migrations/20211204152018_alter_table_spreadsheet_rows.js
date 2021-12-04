const { Knex } = require("knex");

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await knex.schema.alterTable("spreadsheet_rows", (table) => {
    table.dropColumn("mentions");
    table.integer("replies");
    table.integer("tweet_replies");
  });
};

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
  await knex.schema.alterTable("spreadsheet_rows", (table) => {
    table.integer("mentions");
    table.dropColumn("replies");
    table.dropColumn("tweet_replies");
  });
};
