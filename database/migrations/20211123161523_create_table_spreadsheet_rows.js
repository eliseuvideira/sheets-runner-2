const { Knex } = require("knex");

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await knex.schema.createTable("spreadsheet_rows", (table) => {
    // Fields
    table.integer("row_number").notNullable();
    table.string("event_date", 255).notNullable();
    table.string("link_url", 600).notNullable();
    table.string("plataform", 255).notNullable();
    table.string("issues_details", 255).notNullable();
    table.string("issues_details_notes", 600).notNullable();
    table.integer("likes");
    table.integer("retweets");
    table.integer("mentions");
    table.string("user", 255);
    table.string("tweet_id", 255);
    table.string("tweet_content", 600);
    table.dateTime("tweet_created_at", 255);
    table.string("tweet_author_id", 255);
    table.string("tweet_author_username", 255);
    table.string("tweet_author_name", 255);
    table.integer("tweet_likes");
    table.integer("tweet_retweets");

    // Primary Key
    table.primary("row_number");

    // Unique
    table.unique("tweet_id");
  });
};

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
  await knex.schema.dropTable("spreadsheet_rows");
};
