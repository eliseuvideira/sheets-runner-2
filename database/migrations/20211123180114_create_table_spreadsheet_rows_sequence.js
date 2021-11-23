const { Knex } = require("knex");

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await knex.schema.createTable("spreadsheet_rows_sequence", (table) => {
    // Fields
    table.string("lock").notNullable();
    table.integer("sequence").notNullable();

    // Primary Key
    table.primary("lock");
  });
};

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
  await knex.schema.dropTable("spreadsheet_rows_sequence");
};
